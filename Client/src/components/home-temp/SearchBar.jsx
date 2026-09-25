import React, {useState} from 'react'
import {Input, Button} from '../index.js'
import { useNavigate } from 'react-router-dom';


function SearchBar() {
    const [search, isSearch] = useState("")
    const navigate = useNavigate();

    
    function handleSearch(e){
    e.preventDefault();
     if (!search.trim()) return;
     navigate(`/listings?search=${encodeURIComponent(search.trim())}`);
    }
 return (
   <section className="px-5 pb-14 sm:px-6 sm:pb-16">
  <div className="mx-auto max-w-7xl">
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-3xl flex-col gap-2 rounded-3xl border border-black/10 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full"
    >
      <Input
        name="search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="What are you looking for?"
        className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-5 py-3 outline-none"
      />

      <Button
        type="submit"
        className="w-full rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white sm:w-auto"
      >
        Search
      </Button>
    </form>
  </div>
</section>
  );
}

export default SearchBar