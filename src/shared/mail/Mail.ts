export interface Mail {
  to: string;
  templateId: string;
  data?: Record<string, any>;
}
