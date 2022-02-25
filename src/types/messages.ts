export interface RetrieveFilesSuccess {
  message: "Success";
  files: string[];
}

export interface Message {
  message: string;
}
export type Error = Message;

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
