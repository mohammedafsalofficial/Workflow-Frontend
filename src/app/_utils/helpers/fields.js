export const moduleFields = {
  "work-management": ["itemName", "assignedToId", "status", "dueDate"],
  crm: {
    Lead: [
      "leadName",
      "status",
      "company",
      "title",
      "email",
      "lastInteraction",
    ],
  },
  dev: {
    Bug: ["bugName", "reporter", "developer", "priority", "status"],
    Sprint: ["sprintName", "sprintGoals", "startDate", "endDate"],
  },
  service: {
    Ticket: [
      "ticketName",
      "description",
      "employee",
      "agent",
      "priority",
      "status",
      "requestType",
    ],
  },
};
