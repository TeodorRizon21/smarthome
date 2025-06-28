"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FileText, X, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PDFUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function PDFUpload({ value, onChange }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "link">(
    value?.startsWith("http") ? "link" : "file"
  );
  const [linkInput, setLinkInput] = useState(
    value?.startsWith("http") ? value : ""
  );

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      linkInput &&
      (linkInput.endsWith(".pdf") ||
        linkInput.includes("drive.google.com") ||
        linkInput.includes("docs.google.com"))
    ) {
      onChange(linkInput);
      toast({
        title: "Link adăugat",
        description: "Link-ul către PDF a fost salvat cu succes.",
        variant: "default",
      });
    } else {
      toast({
        title: "Link invalid",
        description:
          "Te rugăm să introduci un link valid către un PDF sau un document Google Drive.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-4 space-y-4">
      <RadioGroup
        value={uploadType}
        onValueChange={(value: "file" | "link") => {
          setUploadType(value);
          if (value === "link") {
            onChange(null);
          } else {
            setLinkInput("");
          }
        }}
        className="flex items-center space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="file" id="file" />
          <Label htmlFor="file">Încarcă PDF</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="link" id="link" />
          <Label htmlFor="link">Adaugă Link</Label>
        </div>
      </RadioGroup>

      {value ? (
        <div className="flex items-center gap-4">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            {uploadType === "file" ? (
              <FileText className="h-4 w-4" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            <span>
              {uploadType === "file"
                ? "Vizualizează PDF"
                : "Vizualizează Document"}
            </span>
          </a>
          <Button
            type="button"
            onClick={() => {
              onChange(null);
              setLinkInput("");
            }}
            variant="destructive"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Elimină
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {uploadType === "file" ? (
            <div className="flex items-center gap-4">
              <UploadButton<OurFileRouter, "pdfUploader">
                endpoint="pdfUploader"
                onUploadBegin={() => {
                  setIsUploading(true);
                }}
                onClientUploadComplete={(res) => {
                  setIsUploading(false);
                  if (res) {
                    onChange(res[0].url);
                    toast({
                      title: "Upload reușit",
                      description: "PDF-ul a fost încărcat cu succes.",
                      variant: "default",
                    });
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false);
                  toast({
                    title: "Upload eșuat",
                    description:
                      error.message ||
                      "A apărut o eroare în timpul încărcării.",
                    variant: "destructive",
                  });
                }}
              />
              {isUploading && (
                <div className="text-sm text-muted-foreground animate-pulse">
                  Se încarcă...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <Input
                type="url"
                placeholder="Link către PDF sau Google Drive/Docs"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={(e) => handleLinkSubmit(e as any)}>
                Adaugă Link
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
