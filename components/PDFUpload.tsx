"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FileText, X } from "lucide-react";

interface PDFUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function PDFUpload({ value, onChange }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="mb-4 space-y-4">
      {value ? (
        <div className="flex items-center gap-4">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <FileText className="h-4 w-4" />
            <span>Vizualizează PDF</span>
          </a>
          <Button
            type="button"
            onClick={() => onChange(null)}
            variant="destructive"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Elimină PDF
          </Button>
        </div>
      ) : (
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
                  error.message || "A apărut o eroare în timpul încărcării.",
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
      )}
    </div>
  );
}
