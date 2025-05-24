import { TableData } from '../_components/tableData';
import { createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';  

type Props = {
  params: {
    base: string;
  };
  headers: Headers;
};

export default async function BasePage({ params, headers }: Props) {
    const slug = params.base
    const context = await createTRPCContext({ headers }); 
    const caller = createCaller(context);

    const base = await caller.base.getBaseBySlug({slug: slug as string});

    const table = base ? await caller.base.getFirstTableByBaseId({ baseId: base.id }) : null;

    return (
        <div className='flex flex-col'>
            <div className="bg-green-700">
                Untitled Base
            </div>
            <div className='bg-green-800'>
                Table 1
            </div>
            <div>
                Tools
            </div>
            <div className='flex flex-row'>
                <div>
                    View
                </div>
                <div>
                    <TableData tableData={table} />
                </div>
            </div>
        </div>
    );

}