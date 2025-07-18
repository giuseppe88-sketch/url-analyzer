export interface InaccessibleLink {
  url: string;
  status: number;
}

export interface AnalysisResult {
  ID: number;
  URL: string;
  Title: string;
  HTMLVersion: string;
  HeadingsCount: string; // JSON string of heading counts
  InternalLinks: number;
  ExternalLinks: number;
  InaccessibleLinks: InaccessibleLink[];
  HasLoginForm: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface UrlState {
  results: AnalysisResult[];
  loading: boolean;
  reanalyzing: number[]; // Array of IDs being re-analyzed
  error: string | null;
  url: string;
  addResult: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUrl: (url: string) => void;
  deleteResult: (id: number) => void;
  updateResult: (id: number, newResult: AnalysisResult) => void;
  setReanalyzing: (id: number, status: boolean) => void;
}

export interface GetColumnsParams {
  reanalyzing: number[];
  handleReanalyze: (id: number, url: string) => void;
  handleDelete: (id: number) => void;
}

export interface AnalysisFormProps {
  url: string;
  loading: boolean;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  handleCancel?: () => void;
}

/*
 * Details Page Component Props
 */

export interface LinkAnalysisChartProps {
  internalLinks: number;
  externalLinks: number;
}

export interface HeadingsBreakdownProps {
  headingsCount: string; // JSON string
}
