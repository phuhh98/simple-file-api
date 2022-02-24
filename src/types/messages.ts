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
