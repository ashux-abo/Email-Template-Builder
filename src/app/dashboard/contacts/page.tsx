"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

// Interface for Contact
interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  tags: string[];
}

export default function ContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    company: "",
    tags: "",
  });
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<null | {
    id: string;
    name: string;
    email: string;
    company: string;
    tags: string;
  }>(null);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Function to fetch contacts from the API
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company &&
        contact.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      contact.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Handle adding a new contact
  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newContact.name,
          email: newContact.email,
          company: newContact.company,
          tags: newContact.tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add contact");
      }

      const data = await response.json();
      setContacts([...contacts, data.contact]);
      setNewContact({ name: "", email: "", company: "", tags: "" });
      setIsAddContactOpen(false);

      toast({
        title: "Success",
        description: "Contact added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add contact",
        variant: "destructive",
      });
    }
  };

  // Handle editing a contact
  const handleEditContact = async () => {
    if (!editingContact) return;

    if (!editingContact.name || !editingContact.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingContact.name,
          email: editingContact.email,
          company: editingContact.company,
          tags: editingContact.tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update contact");
      }

      const data = await response.json();

      // Update the contacts state with the updated contact
      setContacts(
        contacts.map((contact) =>
          contact._id === editingContact.id ? data.contact : contact,
        ),
      );

      setEditingContact(null);

      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a contact
  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete contact");
      }

      // Remove the deleted contact from the state
      setContacts(contacts.filter((contact) => contact._id !== id));

      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  // Handle exporting contacts
  const exportContacts = () => {
    const jsonString = JSON.stringify(contacts, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.json";
    a.click();

    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Contacts exported successfully",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Lists</h1>
          <p className="text-muted-foreground mt-2">
            Manage your contacts and recipient lists
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportContacts}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact to your list
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={newContact.company}
                    onChange={(e) =>
                      setNewContact({ ...newContact, company: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={newContact.tags}
                    onChange={(e) =>
                      setNewContact({ ...newContact, tags: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="customer, prospect, newsletter (comma separated)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddContactOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddContact}>Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, company or tag..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No contacts found. Add your first contact to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.company || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingContact({
                              id: contact._id,
                              name: contact.name,
                              email: contact.email,
                              company: contact.company || "",
                              tags: contact.tags.join(", "),
                            });
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact._id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      {editingContact && (
        <Dialog
          open={!!editingContact}
          onOpenChange={(open) => {
            if (!open) setEditingContact(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>
                Make changes to the contact information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingContact.name}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingContact.email}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      email: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">
                  Company
                </Label>
                <Input
                  id="edit-company"
                  value={editingContact.company}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      company: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  value={editingContact.tags}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      tags: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="customer, prospect, newsletter (comma separated)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingContact(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditContact}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
