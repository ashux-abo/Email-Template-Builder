"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";

// Interface for scheduled email
interface ScheduledEmail {
  _id: string;
  subject: string;
  recipientGroup: string;
  recipientCount: number;
  scheduledDate: string;
  template: string;
  templateId: string;
  recurrence: "once" | "daily" | "weekly" | "monthly";
  status: "scheduled" | "sent" | "cancelled" | "failed";
}

// Interface for email template
interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  description: string;
}

// Function to get badge variant based on recurrence
const getRecurrenceBadge = (recurrence: string) => {
  switch (recurrence) {
    case "daily":
      return <Badge className="bg-blue-500">Daily</Badge>;
    case "weekly":
      return <Badge className="bg-purple-500">Weekly</Badge>;
    case "monthly":
      return <Badge className="bg-indigo-500">Monthly</Badge>;
    case "once":
    default:
      return <Badge className="bg-gray-500">One-time</Badge>;
  }
};

// Function to get badge variant based on status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "sent":
      return <Badge className="bg-green-500">Sent</Badge>;
    case "scheduled":
      return <Badge className="bg-yellow-500">Scheduled</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case "failed":
      return <Badge className="bg-red-700">Failed</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

// Format date for display
const formatScheduledDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy h:mm a");
};

export default function EmailSchedulePage() {
  const { toast } = useToast();
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactTags, setContactTags] = useState<string[]>(["all"]);
  const [newEmail, setNewEmail] = useState({
    subject: "",
    recipientGroup: "",
    scheduledDate: "",
    scheduledTime: "",
    templateId: "",
    recurrence: "once",
  });

  // Add state for contacts and manually added recipients
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [manualRecipients, setManualRecipients] = useState<string[]>([]);
  const [newManualRecipient, setNewManualRecipient] = useState("");
  const [contactsSearchQuery, setContactsSearchQuery] = useState("");
  const [showContactsList, setShowContactsList] = useState(false);

  // Fetch scheduled emails, templates, and contact tags
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch scheduled emails
        const emailsResponse = await fetch("/api/scheduled-emails");
        if (!emailsResponse.ok) {
          throw new Error("Failed to fetch scheduled emails");
        }
        const emailsData = await emailsResponse.json();

        // Fetch templates
        const templatesResponse = await fetch("/api/templates");
        if (!templatesResponse.ok) {
          throw new Error("Failed to fetch templates");
        }
        const templatesData = await templatesResponse.json();

        // Fetch contact tags
        const contactsResponse = await fetch("/api/contacts");
        let contactTagsList = ["all"]; // Default to include "all"

        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          const contacts = contactsData.contacts || [];

          // Extract all unique tags from contacts
          const allTags = new Set<string>();
          contacts.forEach((contact: any) => {
            if (contact.tags && Array.isArray(contact.tags)) {
              contact.tags.forEach((tag: string) => {
                if (tag) allTags.add(tag);
              });
            }
          });

          // Add unique tags to the list
          contactTagsList = ["all", ...Array.from(allTags)];

          // Store the contacts list
          setContacts(contacts);
        }

        // Update state
        setScheduledEmails(emailsData.scheduledEmails || []);
        setTemplates(templatesData.templates || []);
        setContactTags(contactTagsList);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Function to handle adding a scheduled email
  const handleAddScheduledEmail = async () => {
    // Validate form
    if (
      !newEmail.subject ||
      (!newEmail.recipientGroup && getAllRecipientEmails().length === 0) ||
      !newEmail.scheduledDate ||
      !newEmail.scheduledTime ||
      !newEmail.templateId
    ) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields and add at least one recipient",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create combined date and time string
      const dateTimeString = `${newEmail.scheduledDate}T${newEmail.scheduledTime}:00`;

      // Get recipients based on selection method
      let recipientList: string[] = [];

      if (newEmail.recipientGroup) {
        // Using a tag/group
        recipientList = [newEmail.recipientGroup]; // The API will resolve this to multiple contacts
      } else {
        // Using selected individual emails
        recipientList = getAllRecipientEmails();

        if (recipientList.length === 0) {
          toast({
            title: "Error",
            description: "Please add at least one recipient",
            variant: "destructive",
          });
          return;
        }
      }

      // Submit to API
      const response = await fetch("/api/scheduled-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: newEmail.subject,
          recipientGroup: newEmail.recipientGroup,
          manualRecipients: newEmail.recipientGroup ? [] : recipientList, // Only send manual list if not using a group
          scheduledDate: dateTimeString,
          templateId: newEmail.templateId,
          recurrence: newEmail.recurrence,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to schedule email");
      }

      const data = await response.json();

      // Add to list
      setScheduledEmails([...scheduledEmails, data.scheduledEmail]);

      // Reset form and close dialog
      setNewEmail({
        subject: "",
        recipientGroup: "",
        scheduledDate: "",
        scheduledTime: "",
        templateId: "",
        recurrence: "once",
      });
      setSelectedContacts([]);
      setManualRecipients([]);
      setNewManualRecipient("");
      setIsAddDialogOpen(false);

      toast({
        title: "Success",
        description: "Email scheduled successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule email",
        variant: "destructive",
      });
    }
  };

  // Function to handle cancelling a scheduled email
  const handleCancelScheduledEmail = async (id: string) => {
    try {
      const response = await fetch(`/api/scheduled-emails/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel scheduled email");
      }

      // Update the local state to reflect the cancellation
      setScheduledEmails(
        scheduledEmails.map((email) =>
          email._id === id ? { ...email, status: "cancelled" } : email,
        ),
      );

      toast({
        title: "Success",
        description: "Scheduled email cancelled",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel scheduled email",
        variant: "destructive",
      });
    }
  };

  // Find template name by ID
  const getTemplateName = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId);
    return template ? template.name : "Unknown Template";
  };

  // Format group name for display
  const formatGroupName = (groupName: string) => {
    if (groupName === "all") return "All Contacts";
    return groupName.charAt(0).toUpperCase() + groupName.slice(1);
  };

  // Handle adding a manual email recipient
  const addManualRecipient = () => {
    // Basic email validation
    if (!newManualRecipient || !validateEmail(newManualRecipient)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Check if already added
    if (manualRecipients.includes(newManualRecipient)) {
      toast({
        title: "Duplicate Email",
        description: "This email has already been added",
        variant: "destructive",
      });
      return;
    }

    setManualRecipients([...manualRecipients, newManualRecipient]);
    setNewManualRecipient("");
  };

  // Remove a manual recipient
  const removeManualRecipient = (email: string) => {
    setManualRecipients(manualRecipients.filter((r) => r !== email));
  };

  // Toggle selection of a contact
  const toggleContactSelection = (contact: any) => {
    if (selectedContacts.some((c) => c._id === contact._id)) {
      setSelectedContacts(
        selectedContacts.filter((c) => c._id !== contact._id),
      );
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  // Basic email validation function
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Get all recipient emails (from both contacts and manual entry)
  const getAllRecipientEmails = () => {
    const contactEmails = selectedContacts.map((contact) => contact.email);
    const allEmails = [...contactEmails, ...manualRecipients];

    // If a recipient group is selected, we'll handle that separately
    if (newEmail.recipientGroup) {
      return allEmails;
    }

    return allEmails;
  };

  // Filter contacts based on search query
  const filteredContacts = contactsSearchQuery
    ? contacts.filter(
        (contact) =>
          contact.name
            .toLowerCase()
            .includes(contactsSearchQuery.toLowerCase()) ||
          contact.email
            .toLowerCase()
            .includes(contactsSearchQuery.toLowerCase()) ||
          (contact.company &&
            contact.company
              .toLowerCase()
              .includes(contactsSearchQuery.toLowerCase())),
      )
    : contacts;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Email Scheduling</h1>
          <p className="text-muted-foreground mt-2">
            Schedule emails to be sent at the perfect time for your audience
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Email
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule an Email</DialogTitle>
              <DialogDescription>
                Set up an email to be sent at a specific time and date
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newEmail.subject}
                  onChange={(e) =>
                    setNewEmail({ ...newEmail, subject: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Email subject"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="recipients" className="text-right pt-2">
                  Recipients
                </Label>
                <div className="col-span-3 space-y-4">
                  <div className="flex flex-col space-x-2">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={
                          newEmail.recipientGroup ? "default" : "outline"
                        }
                        className="w-1/2"
                        onClick={() => {
                          setShowContactsList(false);
                          // Clear manual recipients when switching to group mode
                          if (!newEmail.recipientGroup) {
                            setSelectedContacts([]);
                            setManualRecipients([]);
                          }
                        }}
                      >
                        Use Contact Group
                      </Button>
                      <Button
                        type="button"
                        variant={
                          !newEmail.recipientGroup ? "default" : "outline"
                        }
                        className="w-1/2"
                        onClick={() => {
                          // Clear group selection when switching to manual mode
                          if (newEmail.recipientGroup) {
                            setNewEmail({ ...newEmail, recipientGroup: "" });
                          }
                          setShowContactsList(true);
                        }}
                      >
                        Select Individual Contacts
                      </Button>
                    </div>

                    {/* Group selection mode */}
                    {newEmail.recipientGroup || !showContactsList ? (
                      <Select
                        value={newEmail.recipientGroup}
                        onChange={(e) =>
                          setNewEmail({
                            ...newEmail,
                            recipientGroup: e.target.value,
                          })
                        }
                      >
                        <option value="">Select a contact group</option>
                        {contactTags.map((tag) => (
                          <option key={tag} value={tag}>
                            {formatGroupName(tag)}
                          </option>
                        ))}
                      </Select>
                    ) : null}

                    {/* Individual contacts mode */}
                    {!newEmail.recipientGroup && showContactsList && (
                      <>
                        <div className="border rounded-md p-3 bg-gray-50">
                          {/* Manual email entry */}
                          <div className="flex space-x-2 mb-4">
                            <Input
                              type="email"
                              placeholder="Add email address manually"
                              value={newManualRecipient}
                              onChange={(e) =>
                                setNewManualRecipient(e.target.value)
                              }
                              className="flex-grow"
                            />
                            <Button
                              type="button"
                              onClick={addManualRecipient}
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>

                          {/* Current recipients display */}
                          {(selectedContacts.length > 0 ||
                            manualRecipients.length > 0) && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">
                                Selected Recipients:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedContacts.map((contact) => (
                                  <Badge
                                    key={contact._id}
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 flex items-center"
                                  >
                                    {contact.name}{" "}
                                    <span className="text-xs text-gray-500 ml-1">
                                      ({contact.email})
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 ml-1"
                                      onClick={() =>
                                        toggleContactSelection(contact)
                                      }
                                    >
                                      <span className="sr-only">Remove</span>×
                                    </Button>
                                  </Badge>
                                ))}
                                {manualRecipients.map((email) => (
                                  <Badge
                                    key={email}
                                    variant="outline"
                                    className="pl-2 pr-1 py-1 flex items-center"
                                  >
                                    {email}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 ml-1"
                                      onClick={() =>
                                        removeManualRecipient(email)
                                      }
                                    >
                                      <span className="sr-only">Remove</span>×
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Search and browse contacts */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Browse Contacts:
                            </h4>
                            <Input
                              type="text"
                              placeholder="Search contacts..."
                              value={contactsSearchQuery}
                              onChange={(e) =>
                                setContactsSearchQuery(e.target.value)
                              }
                              className="mb-2"
                            />
                            <div className="max-h-40 overflow-y-auto border rounded-md">
                              {filteredContacts.length > 0 ? (
                                <div className="divide-y">
                                  {filteredContacts.map((contact) => (
                                    <div
                                      key={contact._id}
                                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                        selectedContacts.some(
                                          (c) => c._id === contact._id,
                                        )
                                          ? "bg-blue-50"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        toggleContactSelection(contact)
                                      }
                                    >
                                      <div className="font-medium">
                                        {contact.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {contact.email}
                                      </div>
                                      {contact.company && (
                                        <div className="text-xs text-gray-400">
                                          {contact.company}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                  No contacts found
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template" className="text-right">
                  Template
                </Label>
                <div className="col-span-3">
                  <select
                    id="template"
                    value={newEmail.templateId}
                    onChange={(e) =>
                      setNewEmail({ ...newEmail, templateId: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select email template</option>
                    {templates.map((template) => (
                      <option key={template._id} value={template._id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="date"
                      type="date"
                      value={newEmail.scheduledDate}
                      onChange={(e) =>
                        setNewEmail({
                          ...newEmail,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="time"
                      type="time"
                      value={newEmail.scheduledTime}
                      onChange={(e) =>
                        setNewEmail({
                          ...newEmail,
                          scheduledTime: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recurrence" className="text-right">
                  Recurrence
                </Label>
                <div className="col-span-3">
                  <select
                    id="recurrence"
                    value={newEmail.recurrence}
                    onChange={(e) =>
                      setNewEmail({ ...newEmail, recurrence: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select recurrence pattern</option>
                    <option value="once">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddScheduledEmail}>Schedule Email</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Scheduled Emails */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : scheduledEmails.length === 0 ? (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No scheduled emails</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                You haven't scheduled any emails yet.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule your first email
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Recurrence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledEmails.map((email) => (
                  <TableRow key={email._id}>
                    <TableCell className="font-medium">
                      {email.subject}
                    </TableCell>
                    <TableCell>{email.template}</TableCell>
                    <TableCell>
                      {email.recipientCount}{" "}
                      {email.recipientGroup !== "all" ? (
                        <Badge variant="outline" className="ml-1">
                          {email.recipientGroup}
                        </Badge>
                      ) : (
                        "contacts"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatScheduledDate(email.scheduledDate)}
                    </TableCell>
                    <TableCell>
                      {getRecurrenceBadge(email.recurrence)}
                    </TableCell>
                    <TableCell>{getStatusBadge(email.status)}</TableCell>
                    <TableCell className="text-right">
                      {email.status === "scheduled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelScheduledEmail(email._id)}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Cancel</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
