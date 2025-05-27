import type React from "react";
import MDEditor from '@uiw/react-md-editor';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, FileText } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";

// Define Zod schema for validation
const questionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  problemDetails: z.string().min(20, "Problem details must be at least 20 characters").max(5000, "Problem details must be 5000 characters or less"),
  tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Maximum 5 tags allowed"),
  images: z.array(z.instanceof(File)).max(1, "Only one image is allowed").refine(
    (files) => files.every((file) => file.type.startsWith("image/")),
    "Only image files are allowed"
  ).optional(),
  documents: z.array(z.instanceof(File)).max(1, "Only one document is allowed").refine(
    (files) => files.every((file) => ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)),
    "Only PDF, TXT, DOC, or DOCX files are allowed"
  ).optional(),
  isBounty: z.boolean(),
  bountyCoins: z.number().min(10, "Bounty must be at least 10 coins").optional().or(z.literal(0)),
}).refine(
  (data) => !data.isBounty || (data.isBounty && data.bountyCoins >= 10),
  { message: "Bounty must be at least 10 coins when enabled", path: ["bountyCoins"] }
);

interface QuestionFormProps {
  onSubmit?: (data: QuestionFormData) => void;
}

interface QuestionFormData {
  title: string;
  problemDetails: string;
  tags: string[];
  images: File[];
  documents: File[];
  isBounty: boolean;
  bountyCoins: number;
}

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    problemDetails: "",
    tags: [],
    images: [],
    documents: [],
    isBounty: false,
    bountyCoins: 0,
  });

  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleProblemDetailsChange = (value?: string) => {
    setFormData((prev) => ({ ...prev, problemDetails: value || "" }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 5) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
      setFormData((prev) => ({ ...prev, images: [file] }));
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, TXT, DOC, or DOCX files are allowed");
        return;
      }
      setFormData((prev) => ({ ...prev, documents: [file] }));
    }
  };

  const handleBountyToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isBounty: e.target.checked, bountyCoins: e.target.checked ? prev.bountyCoins : 0 }));
  };

  const handleBountyCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, bountyCoins: value >= 0 ? value : 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data with Zod
      const validatedData = questionFormSchema.parse(formData);

      await onSubmit?.(validatedData);
      setFormData({
        title: "",
        problemDetails: "",
        tags: [],
        images: [],
        documents: [],
        isBounty: false,
        bountyCoins: 0,
      });
      setTagInput("");
      toast.success("Question posted successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        console.error("Error submitting question:", error);
        toast.error("Failed to post question. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">How to Ask a Good Question</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Write a clear, specific title that summarizes your question</li>
            <li>Provide detailed information about your problem, including code samples if applicable</li>
            <li>Add relevant tags (up to 5) to categorize your question</li>
            <li>Include one image or one document (PDF, TXT, DOC, DOCX) if they help clarify the issue</li>
            <li>Check for existing similar questions before posting</li>
            <li>If offering a bounty, set a reasonable coin amount (minimum 10)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold">
                Title
              </Label>
              <p className="text-sm text-gray-600">
                Be specific and imagine you're asking a question to another person.
              </p>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                className="text-base"
              />
            </div>

            <div className="flex gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {formData.images.length > 0 ? "Replace Image" : "Add Image"}
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="text-sm text-gray-600">1 image selected: {formData.images[0].name}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("document-upload")?.click()}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {formData.documents.length > 0 ? "Replace Document" : "Add Document"}
                  </Button>
                </div>
                {formData.documents.length > 0 && (
                  <div className="text-sm text-gray-600">1 document selected: {formData.documents[0].name}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">What are the details of your problem?</Label>
              <p className="text-sm text-gray-600">
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </p>
              <div className="border rounded-md overflow-hidden">
                <MDEditor
                  value={formData.problemDetails}
                  onChange={handleProblemDetailsChange}
                  preview="live"
                  hideToolbar={false}
                  height={300}
                  data-color-mode="light"
                />
              </div>
              <div className="text-xs text-gray-500">{formData.problemDetails.length}/20 characters minimum</div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Tags</Label>
              <p className="text-sm text-gray-600">
                Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
              </p>
              <div className="space-y-2">
                <Input
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagInputKeyPress}
                  onBlur={addTag}
                  placeholder="e.g. (mongodb wordpress iphone)"
                  className="text-base"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500">{formData.tags.length}/5 tags</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bounty-toggle"
                  checked={formData.isBounty}
                  onChange={handleBountyToggle}
                  className="h-4 w-4"
                />
                <Label htmlFor="bounty-toggle" className="text-lg font-semibold">
                  Make this a bounty question
                </Label>
              </div>
              {formData.isBounty && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="bounty-coins" className="text-base font-medium">
                    Bounty Coins (minimum 10)
                  </Label>
                  <Input
                    id="bounty-coins"
                    type="number"
                    min="10"
                    value={formData.bountyCoins || ""}
                    onChange={handleBountyCoinsChange}
                    placeholder="Enter bounty coins"
                    className="w-32"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Asking..." : "ASK"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}