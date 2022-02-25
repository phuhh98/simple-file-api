export interface RetrieveFilesSuccess {
  message: "Success";
  files: string[];
}

export interface Error {
  message: string;
}

export interface CreateFileSuccess {
  message: string;
}

export interface RetrievedFileData {
  message: "Success";
  filename: string;
  content: string;
  extension: string;
  uploadedDate: string;
}
