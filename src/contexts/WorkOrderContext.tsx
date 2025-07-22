"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from 'sonner'
import { User } from '@prisma/client'

// Define types
export type WorkOrder = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  problem: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  assignedTo: User | null;
  createdBy: User;
};

type State = {
  workOrders: WorkOrder[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WorkOrder[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_WORK_ORDER'; payload: WorkOrder }
  | { type: 'UPDATE_WORK_ORDER'; payload: WorkOrder }
  | { type: 'DELETE_WORK_ORDER'; payload: string }

const initialState: State = {
  workOrders: [],
  loading: false,
  error: null,
};

function workOrderReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        workOrders: action.payload,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_WORK_ORDER':
      return {
        ...state,
        workOrders: [...state.workOrders, action.payload],
      };
    case 'UPDATE_WORK_ORDER':
      return {
        ...state,
        workOrders: state.workOrders.map((wo) =>
          wo.id === action.payload.id ? action.payload : wo
        ),
      };
    case 'DELETE_WORK_ORDER':
      return {
        ...state,
        workOrders: state.workOrders.filter((wo) => wo.id !== action.payload),
      };
    default:
      return state;
  }
}

export interface WorkOrderContextType {
  state: State;
  fetchWorkOrders: () => Promise<void>;
  getWorkOrder: (id: string) => Promise<WorkOrder | null>;
  createWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateWorkOrder: (id: string, workOrder: Partial<WorkOrder>) => Promise<boolean>;
  deleteWorkOrder: (id: string) => Promise<boolean>;
}

const WorkOrderContext = createContext<WorkOrderContextType | undefined>(undefined);

export function WorkOrderProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(workOrderReducer, initialState);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchWorkOrders = useCallback(async () => {
    if (!mounted.current) return;

    try {
      dispatch({ type: 'FETCH_START' });
      const response = await fetch("/api/work-orders");
      
      if (!mounted.current) return;
      
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }
      
      const data = await response.json();
      
      if (mounted.current) {
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      }
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        dispatch({ type: 'FETCH_ERROR', payload: message });
        toast.error(message);
      }
    }
  }, []);

  const getWorkOrder = useCallback(async (id: string): Promise<WorkOrder | null> => {
    if (!mounted.current) return null;

    try {
      dispatch({ type: 'FETCH_START' });
      const response = await fetch(`/api/work-orders/${id}`);
      
      if (!mounted.current) return null;
      
      if (!response.ok) {
        throw new Error('Failed to fetch work order');
      }
      
      const data = await response.json();
      
      if (mounted.current) {
        dispatch({ type: 'FETCH_SUCCESS', payload: [data] });
        return data;
      }
      return null;
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        dispatch({ type: 'FETCH_ERROR', payload: message });
        toast.error(message);
      }
      return null;
    }
  }, []);

  const createWorkOrder = useCallback(async (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!mounted.current) return false;

    try {
      const response = await fetch("/api/work-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workOrder),
      });
      
      if (!mounted.current) return false;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create work order');
      }
      
      if (mounted.current) {
        dispatch({ type: 'ADD_WORK_ORDER', payload: data });
        toast.success('บันทึกข้อมูลสำเร็จ');
        return true;
      }
      return false;
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        toast.error(message);
      }
      return false;
    }
  }, []);

  const updateWorkOrder = useCallback(async (id: string, workOrder: Partial<WorkOrder>): Promise<boolean> => {
    if (!mounted.current) return false;

    try {
      const response = await fetch(`/api/work-orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workOrder),
      });
      
      if (!mounted.current) return false;

      if (!response.ok) {
        throw new Error('Failed to update work order');
      }

      const data = await response.json();
      
      if (mounted.current) {
        dispatch({ type: 'UPDATE_WORK_ORDER', payload: data });
        toast.success('Work order updated successfully');
        return true;
      }
      return false;
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        toast.error(message);
      }
      return false;
    }
  }, []);

  const deleteWorkOrder = useCallback(async (id: string): Promise<boolean> => {
    if (!mounted.current) return false;

    try {
      const response = await fetch(`/api/work-orders/${id}`, {
        method: "DELETE",
      });

      if (!mounted.current) return false;

      if (!response.ok) {
        throw new Error('Failed to delete work order');
      }

      if (mounted.current) {
        dispatch({ type: 'DELETE_WORK_ORDER', payload: id });
        toast.success('Work order deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      if (mounted.current) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        toast.error(message);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchWorkOrders().catch(console.error);
    }
  }, [session?.user, fetchWorkOrders]);

  const contextValue = React.useMemo(() => ({
    state,
    fetchWorkOrders,
    getWorkOrder,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
  }), [
    state,
    fetchWorkOrders,
    getWorkOrder,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
  ]);

  return (
    <WorkOrderContext.Provider value={contextValue}>
      {children}
    </WorkOrderContext.Provider>
  );
}

export function useWorkOrder(): WorkOrderContextType {
  const context = useContext(WorkOrderContext);
  if (context === undefined) {
    throw new Error("useWorkOrder must be used within a WorkOrderProvider");
  }
  return context;
} 