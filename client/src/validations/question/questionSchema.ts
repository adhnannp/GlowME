import { z } from "zod";

export const baseQuestionFormSchema = z.object({
  title: z.string().trim().min(10, "Title required atleast 10 characters long").max(200, "Title must be 200 characters or less"),
  problemDetails: z.string().trim().min(20, "Problem details must be at least 20 characters").max(5000, "Problem details must be 5000 characters or less"),
  tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Maximum 5 tags allowed"),
  image: z.instanceof(File).refine(
    (file) => file.type.startsWith("image/"),
    "Only image files are allowed"
  ).nullable() 
  .optional(),
  document: z.instanceof(File).refine(
    (file) => ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type),
    "Only PDF, TXT, DOC, or DOCX files are allowed"
  ).optional().nullable() ,
  isBounty: z.boolean(),
  bountyCoins: z.number().min(0).default(0),
});

export const questionFormSchema = baseQuestionFormSchema.refine(
  (data) => !data.isBounty || data.bountyCoins >= 10,
  { message: "Bounty must be at least 10 coins when enabled", path: ["bountyCoins"] }
);

export type QuestionFormData = z.infer<typeof questionFormSchema>;