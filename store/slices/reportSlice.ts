import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { createReportStateSlice, ReportSlice } from './reportStateSlice';
import { createImageSlice, ImageSlice } from './imageSlice';
import { createCustomFieldSlice, CustomFieldSlice } from './customFieldSlice';

export type FullReportSlice = ReportSlice & ImageSlice & CustomFieldSlice;

export const createReportSlice: StateCreator<
    AppStore,
    [],
    [],
    FullReportSlice
> = (set, get, api) => ({
    ...createReportStateSlice(set, get, api),
    ...createImageSlice(set, get, api),
    ...createCustomFieldSlice(set, get, api),
});
