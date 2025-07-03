export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params; // await ตรงนี้
  const id = params.id;

  const workOrder = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      createdBy: true,
    },
  });

  if (!workOrder) {
    return new Response(JSON.stringify({ error: "ไม่พบข้อมูล" }), { status: 404 });
  }

  return new Response(JSON.stringify(workOrder), {
    headers: { "Content-Type": "application/json" },
  });
}
