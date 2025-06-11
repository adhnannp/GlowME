import mongoose from 'mongoose';
import { IReport } from '../../models/Report';
import { SafeUser } from './SafeUser';

export type SafeUserWithId = SafeUser & { _id: mongoose.Types.ObjectId };

export type PopulatedReport = Omit<IReport, 'reporter' | 'reported_user'> & {
    reporter: SafeUserWithId;
    reported_user: SafeUserWithId;
};

export default interface GroupedReport {
    reportedUser: SafeUserWithId;
    reports: PopulatedReport[];
};