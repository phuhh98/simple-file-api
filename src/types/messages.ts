export interface RetrieveFilesSuccess {
  message: "Success";
  files: string[];
}

export interface ClientError {
  message: string | "Client error";
}

export interface ServerError {
  message: string | "Server error";
}

export interface RetrieveFileDataSuccess {
  message: "Success";
  filename: string;
  content: string;
  /* Supported file types */
  extension: "log" | "txt" | "json" | "yaml" | "xml" | "js";
  uploadedDate: string;
}
