import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { VscSettings } from "react-icons/vsc";
import { Slider } from "../components/ui/slider";

export function FilterDialog({filterFn}) {
  const [filterType, setFilterType] = useState("All");
  const [priceRange, setPriceRange] = useState([100]); // Default price range

  const categories = [
    { name: "All" },
    { name: "Music" },
    { name: "Tech" },
    { name: "Sports" },
    { name: "Education" },
  ];



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <VscSettings className="text-[#FEFEFE]" size={22} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-[#181818] text-[#FEFEFE]"
        style={{ padding: "10px", background: "#181818" }}
      >
        <DialogHeader>
          <DialogTitle>Filter Events</DialogTitle>
          <DialogDescription>
            Select your filter options and apply them to refine event results.
          </DialogDescription>
        </DialogHeader>

        {/* Category Selection */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 p-4 gap-1">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center text-[12px] h-11 w-25 rounded-3xl ${
                filterType === c.name ? "bg-[#F2F862]" : "bg-gray-200"
              } cursor-pointer`}
              onClick={() => setFilterType(c.name)}
            >
              <span className="text-[#000000]">{c.name}</span>
            </div>
          ))}
        </div>

        {/* Price Slider */}
        <div className="px-4 py-3">
          <h3 className="text-sm text-gray-300 mb-2">Price Range: ${priceRange[0]}</h3>
          <Slider
            defaultValue={[100]}
            max={10000}
            step={10}
            onValueChange={(value) => setPriceRange(value)}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => filterFn(filterType, priceRange[0])}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
