// TicketPanel.tsx
import React from 'react';
// Update the path below to the correct relative path to DashboardContext
import { useDashboard } from '../../context/DashboardContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

const TicketPanel = () => {
  const { 
    selectedTickets, 
    isPanelOpen, 
    selectedCategory, 
    selectedValue,
    togglePanel, 
    clearSelectedTickets,
    isLoading,
    columnMapping,
    columnLabels,
  } = useDashboard();


  
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const generateTitle = () => {
    if (!selectedCategory || !selectedValue) return 'Selected Tickets';
    return `${selectedValue} ${selectedCategory} Tickets`; // Generates title like "Open Status Tickets"
  };

  const getDisplayFields = () => {
    if (!selectedTickets || selectedTickets.length === 0) return [];
    // Fields to display (only those with mapped columns)
    const allFields = [
      { key: 'ticketNumber', label: columnLabels.ticketNumber || 'Ticket Number', mapping: columnMapping.ticketNumber },
      { key: 'date', label: columnLabels.startDate || 'Date', mapping: columnMapping.startDate },
      { key: 'client', label: columnLabels.customer || 'Client', mapping: columnMapping.customer },
      { key: 'technology', label: columnLabels.technology || 'Technology', mapping: columnMapping.technology },
      { key: 'ticketType', label: columnLabels.ticketType || 'Ticket Type', mapping: columnMapping.ticketType },
      { key: 'status', label: columnLabels.state || 'Status', mapping: columnMapping.state },
      { key: 'assignedTo', label: columnLabels.assignedTo || 'Assigned To', mapping: columnMapping.assignedTo },
      { key: 'assignmentGroup', label: columnLabels.assignmentGroup || 'Assignment Group', mapping: columnMapping.assignmentGroup },
      { key: 'createdBy', label: columnLabels.createdBy || 'Created By', mapping: columnMapping.createdBy },
      { key: 'priority', label: columnLabels.priority || 'Priority', mapping: columnMapping.priority },
    ];
    let fields = allFields.filter(f => f.mapping);
    if (selectedCategory) {
      const categoryToFieldMap: { [key: string]: string } = {
        technology: 'technology',
        client: 'client',
        tickettype: 'ticketType',
        status: 'status',
        assignedto: 'assignedTo',
        date: 'date',
        ticketnumber: 'ticketNumber',
      };
      const categoryKey = selectedCategory.toLowerCase();
      const fieldToExclude = categoryToFieldMap[categoryKey];
      if (fieldToExclude) {
        fields = fields.filter(field => field.key !== fieldToExclude);
      }
    }
    return fields;
  };

  const formatFieldName = (field: string) => {
    switch (field) {
      case 'ticketNumber': return 'Ticket Number';
      case 'ticketType': return 'Ticket Type';
      case 'assignedTo': return 'Assigned To';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCellValue = (ticket: any, field: string) => {
    if (field === 'date') {
      return formatDate(ticket.date);
    }
    // Since context normalizes data, use normalized keys directly:
    return ticket[field] ?? 'N/A';
  };

  const displayFields = getDisplayFields();

  return (
    <Sheet open={isPanelOpen} onOpenChange={togglePanel}>
      <SheetContent
        className="sm:max-w-4xl max-w-full flex flex-col overflow-auto min-w-[400px]"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="flex justify-between items-center">
            <span>{generateTitle()}</span>
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearSelectedTickets} // Closes the panel and clears selected tickets
              aria-label="Close ticket panel"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Loading tickets...
          </div>
        ) : selectedTickets && selectedTickets.length > 0 ? (
          <>
            <div className="text-sm text-muted-foreground mb-4">
              Showing {selectedTickets.length} tickets
            </div>

            <div className="flex-1 overflow-auto">
              <Table className="table-auto min-w-[400px] break-words">
                <TableHeader>
                  <TableRow>
                    {displayFields.map(field => (
                      <TableHead 
                        key={field.key} 
                        className="sticky top-0 bg-white z-20 border-b border-gray-200"
                      >
                        {field.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTickets.map((ticket, index) => (
                    <TableRow key={ticket.id ?? `${ticket.ticketNumber}-${index}`}>
                      {displayFields.map(field => (
                        <TableCell key={`${ticket.id ?? ticket.ticketNumber}-${field.key}`} className="break-words max-w-xs">
                          {getCellValue(ticket, field.key)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            No tickets selected
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TicketPanel;