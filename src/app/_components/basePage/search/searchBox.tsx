import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";

type SearchBoxProps = {
  setSearchInput: (search: string) => void;
};

export function SearchBox({ setSearchInput }: SearchBoxProps) {
  const utils = api.useUtils();
  async function handleChange(newSearch: string) {
    setSearchInput(newSearch);
    await utils.cell.infiniteRows.cancel();
    await utils.cell.infiniteRows.invalidate();
  }
  return (
    <div>
      <Input
        className="m-0 h-[4vh] py-2 focus-visible:ring-0"
        type="text"
        placeholder="Search..."
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
