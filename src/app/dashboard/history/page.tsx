"use client";

import { useState, useEffect } from "react";
import {
  SearchIcon,
  RefreshCw,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { Badge } from "../../../components/ui/badge";

// Define the type for email data
interface EmailData {
  id: string;
  subject: string;
  recipient: string;
  recipients?: string[];
  templateId: string;
  sentDate: string;
  status: string;
  errorMessage?: string;
  template?: string; // For display purposes
  content?: string; // Add content property for email preview
}

// Function to get badge variant based on status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
    case "delivered":
      return <Badge className="bg-green-500">Delivered</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case "failed":
    case "bounced":
      return <Badge className="bg-red-500">Failed</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function EmailHistoryPage() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Function to fetch email history
  const fetchEmailHistory = async (
    page = 1,
    search = searchQuery,
    status = statusFilter,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct URL with query parameters
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status && status !== "all") params.set("status", status);
      params.set("page", page.toString());
      params.set("limit", pagination.limit.toString());

      const response = await fetch(`/api/email/history?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch email history");
      }

      const data = await response.json();

      // Fetch template names if needed
      const emailsWithTemplateNames = await Promise.all(
        data.emails.map(async (email: EmailData) => {
          // Skip if no template ID or already has template name
          if (!email.templateId || email.template) return email;

          try {
            const templateRes = await fetch(
              `/api/templates/${email.templateId}`,
            );
            if (templateRes.ok) {
              const templateData = await templateRes.json();
              return {
                ...email,
                template: templateData.template?.name || "Unknown Template",
              };
            }
          } catch (error) {
            console.error("Error fetching template:", error);
          }

          return {
            ...email,
            template: "Unknown Template",
          };
        }),
      );

      setEmails(emailsWithTemplateNames);
      setPagination({
        ...pagination,
        page: data.pagination.page,
        total: data.pagination.total,
        pages: data.pagination.pages,
      });
    } catch (error: any) {
      console.error("Error fetching email history:", error);
      setError(error.message || "Failed to fetch email history");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch email history",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch emails on initial load and when filters change
  useEffect(() => {
    fetchEmailHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search query change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmailHistory(1, searchQuery, statusFilter);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchEmailHistory(newPage, searchQuery, statusFilter);
    }
  };

  const handleRefresh = () => {
    fetchEmailHistory(pagination.page, searchQuery, statusFilter);
    toast({
      title: "Refreshed",
      description: "Email history has been refreshed",
    });
  };

  const viewEmailDetails = async (email: EmailData) => {
    setSelectedEmail(email);
    setIsDetailsOpen(true);

    // Fetch full email details including content if not already loaded
    if (!email.content) {
      setIsLoadingDetails(true);
      try {
        const response = await fetch(`/api/email/history/${email.id}`);
        if (response.ok) {
          const data = await response.json();
          // Update the selected email with full details
          setSelectedEmail((prevState) => {
            if (prevState && prevState.id === data.email.id) {
              return {
                ...prevState,
                ...data.email,
              };
            }
            return prevState;
          });
        } else {
          console.error("Failed to fetch email content");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load email content",
          });
        }
      } catch (error) {
        console.error("Error fetching email details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading email content",
        });
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Email History</h1>
          <p className="text-muted-foreground mt-2">View your sent emails</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 relative">
              <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by subject or recipient..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value: string) => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Delivered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 border border-red-200">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Emails Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell
                      colSpan={6}
                      className="h-12 animate-pulse bg-gray-100"
                    ></TableCell>
                  </TableRow>
                ))
              ) : emails.length > 0 ? (
                // Email data
                emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {email.subject}
                    </TableCell>
                    <TableCell>
                      {email.recipients && email.recipients.length > 1
                        ? `${email.recipient} + ${email.recipients.length - 1} more`
                        : email.recipient}
                    </TableCell>
                    <TableCell>{formatDate(email.sentDate)}</TableCell>
                    <TableCell>{email.template || "Unknown"}</TableCell>
                    <TableCell>{getStatusBadge(email.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewEmailDetails(email)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // No data state
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No emails found. Try a different search or filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {emails.length} of {pagination.total} emails
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1 || isLoading}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages || isLoading}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          {selectedEmail && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEmail.subject}</DialogTitle>
                <DialogDescription>
                  Sent on {formatDate(selectedEmail.sentDate)}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Status
                    </h3>
                    <div className="mt-1">
                      {getStatusBadge(selectedEmail.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Template
                    </h3>
                    <div className="mt-1 font-medium">
                      {selectedEmail.template || "Unknown Template"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Recipients
                  </h3>
                  <div className="mt-1">
                    {selectedEmail.recipients &&
                    selectedEmail.recipients.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {selectedEmail.recipients.map((recipient, index) => (
                          <li key={index}>{recipient}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>{selectedEmail.recipient}</span>
                    )}
                  </div>
                </div>

                {selectedEmail.errorMessage && (
                  <div>
                    <h3 className="text-sm font-medium text-red-600">Error</h3>
                    <div className="mt-1 text-red-700 bg-red-50 p-2 rounded-md border border-red-100">
                      {selectedEmail.errorMessage}
                    </div>
                  </div>
                )}

                <div className="rounded-md border p-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">
                        Email Content Preview
                      </h3>
                    </div>
                    {isLoadingDetails && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Loading content...
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md min-h-[200px] max-h-[400px] overflow-auto">
                    <div className="border-b pb-2 mb-4">
                      <div className="font-medium">
                        Subject: {selectedEmail.subject}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        To:{" "}
                        {selectedEmail.recipients?.join(", ") ||
                          selectedEmail.recipient}
                      </div>
                    </div>
                    {isLoadingDetails ? (
                      <div className="flex items-center justify-center h-[300px] bg-gray-100 animate-pulse">
                        <p className="text-muted-foreground">
                          Loading email content...
                        </p>
                      </div>
                    ) : selectedEmail.content ? (
                      <iframe
                        srcDoc={selectedEmail.content}
                        className="w-full h-[300px] border-0 bg-white"
                        title="Email content"
                        sandbox="allow-same-origin allow-scripts"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-[300px] bg-gray-100">
                        <p className="text-muted-foreground">
                          Content not available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
