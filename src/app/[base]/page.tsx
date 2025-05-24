import { TableData } from '../_components/tableData';
import { createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';  
import { headers } from 'next/headers';
import { BaseDisplay } from '../_components/baseDisplay';

type Props = {
    params: Promise<{
    base: string;
  }>
};

export default async function BasePage() {
    return (
        <BaseDisplay />
    );
}