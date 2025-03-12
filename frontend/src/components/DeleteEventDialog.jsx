import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MdDeleteOutline } from "react-icons/md";


const DeleteEventDialog = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onOpenChange={onClose} >
        <DialogTrigger>
            <MdDeleteOutline size={20} />

        </DialogTrigger>
      <DialogContent className="sm:max-w-md" style={{padding:"10px"}}>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <p className="text-gray-500">Do you really want to delete this event? This action cannot be undone.</p>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEventDialog