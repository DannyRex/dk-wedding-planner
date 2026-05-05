export type WeddingArea =
  | 'Court Wedding'
  | 'White Wedding'
  | 'Traditional Wedding'
  | 'Pre-Wedding Shoot'
  | 'General';

export type Owner = 'Daniel' | 'Kelechi' | 'Both' | 'Bride' | 'Groom';
export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not started' | 'In progress' | 'Completed' | 'Blocked';
export type PaymentStatus = 'Unpaid' | 'Deposit paid' | 'Fully paid' | 'Overdue';
export type RSVPStatus = 'Pending' | 'Accepted' | 'Declined' | 'Maybe';

export interface BudgetItem {
  id: string;
  item: string;
  weddingArea: WeddingArea;
  category: string;
  estimatedBudget: number;
  actualCost: number;
  paid: number;
  paymentStatus: PaymentStatus;
  paymentDue: string;
  vendor: string;
  notes: string;
}

export interface Task {
  id: string;
  task: string;
  weddingArea: WeddingArea;
  category: string;
  owner: Owner;
  deadline: string;
  status: TaskStatus;
  priority: Priority;
  dependency: string;
  done: boolean;
  notes: string;
}

export interface Vendor {
  id: string;
  vendor: string;
  service: string;
  weddingArea: WeddingArea;
  contactName: string;
  phoneEmail: string;
  quote: number;
  paid: number;
  status: string;
  followUpDate: string;
  notes: string;
}

export interface Guest {
  id: string;
  guestName: string;
  side: 'Daniel' | 'Kelechi' | 'Both';
  weddingArea: WeddingArea;
  invited: boolean;
  rsvp: RSVPStatus;
  adults: number;
  children: number;
  tableGroup: string;
  gift: boolean;
  contact: string;
  notes: string;
}

export interface TimelinePhase {
  id: string;
  phase: string;
  targetPeriod: string;
  keyActions: string;
  weddingArea: WeddingArea;
  owner: Owner;
  status: TaskStatus;
  notes: string;
  done: boolean;
}

export interface Decision {
  id: string;
  date: string;
  decision: string;
  weddingArea: WeddingArea;
  whyWeChoseIt: string;
  owner: Owner;
  status: string;
  notes: string;
}

export interface ChecklistItem {
  id: string;
  done: boolean;
  item: string;
  weddingArea: WeddingArea;
  priority: Priority;
  deadline: string;
  notes: string;
}

export interface WeddingData {
  budget: BudgetItem[];
  tasks: Task[];
  vendors: Vendor[];
  guests: Guest[];
  timeline: TimelinePhase[];
  decisions: Decision[];
  checklist: ChecklistItem[];
  lastUpdated: string;
  updatedBy: string;
}
