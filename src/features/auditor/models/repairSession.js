export function approveRepair(approved, skipped, repair) {
  const nextSkipped = { ...skipped }
  delete nextSkipped[repair.findingId]
  return {
    approved: {
      ...approved,
      [repair.findingId]: {
        findingId: repair.findingId,
        value: repair.value,
        repairType: repair.repairType,
      },
    },
    skipped: nextSkipped,
  }
}

export function approveSafeRepairSet(approved, skipped, repairs) {
  const nextApproved = { ...approved }
  const nextSkipped = { ...skipped }
  repairs.forEach((repair) => {
    nextApproved[repair.findingId] = {
      findingId: repair.findingId,
      value: repair.value,
      repairType: "safe",
    }
    delete nextSkipped[repair.findingId]
  })
  return { approved: nextApproved, skipped: nextSkipped }
}

export function skipRepair(approved, skipped, findingId) {
  const nextApproved = { ...approved }
  delete nextApproved[findingId]
  return {
    approved: nextApproved,
    skipped: { ...skipped, [findingId]: true },
  }
}

export function getSelectedRepairs(approved) {
  return Object.values(approved)
}
