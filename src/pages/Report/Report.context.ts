import { Dispatch, createContext } from 'react';
import { ReportInitialState } from './Report.state';
import { ActionType } from '@/hooks/useCreateReducer';

export interface ReportContextProps {
  state: ReportInitialState;
  dispatch: Dispatch<ActionType<ReportInitialState>>;
}

const ReportContext = createContext<ReportContextProps>(undefined!);

export default ReportContext;
