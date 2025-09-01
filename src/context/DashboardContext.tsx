/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { addMonths } from "date-fns";
import { mapExcelColumns } from "../utils/dataProcessor";
import { toast } from "sonner";

export interface FilterState {
  uploadedFile: any;
  startDate: Date;
  endDate: Date;
  technology: string[];
  client: string[];
  ticketType: string[];
  assignedTo: string[];
  status: string[];
  ticketNumber: string[];
  site?: string[];
  configurationItem?: string[];
  createdBy?: string[];
  assignmentGroup?: string[];
  priority?: string[];
  closedBy?: string[];
}

export interface TicketData {
  id: string | number;
  date: Date | string;
  technology: string;
  client: string;
  ticketType: string;
  assignedTo: string;
  status: string;
  ticketNumber: string;
  responseTime?: number;
  satisfaction?: number;
  [key: string]: any;
}

interface DashboardContextType {
  rawData: any[] | null;
  allData: TicketData[]; // ✅ NEW
  processedData: TicketData[] | null;
  filteredData: TicketData[] | null;
  selectedTickets: TicketData[] | null;
  selectedCategory: string | null;
  selectedValue: string | null;
  filters: FilterState;
  uniqueValues: Record<string, string[]>;
  isLoading: boolean;
  isDarkMode: boolean;
  isPanelOpen: boolean;
  updateFilters: (
    newFilters: Partial<FilterState>,
    applyImmediately?: boolean
  ) => void;
  resetFilters: () => void;
  applyFilters: (filtersToApply?: FilterState) => void;
  loadExcelData: (data: any[]) => void;
  toggleDarkMode: () => void;
  selectTicketsByCategory: (
    category: string,
    values: string[] | string
  ) => void;
  clearSelectedTickets: () => void;
  togglePanel: () => void;
  setSelectedTickets: (tickets: TicketData[]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedValue: (value: string) => void;
  columnMapping: Record<string, string | null>;
  columnLabels: Record<string, string | null>;
}

export const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const defaultStartDate = addMonths(new Date(), -2);
  const defaultEndDate = new Date();

  const [rawData, setRawData] = useState<any[] | null>(null);
  const [allData, setAllData] = useState<TicketData[]>([]); // ✅ NEW
  const [processedData, setProcessedData] = useState<TicketData[] | null>(null);
  const [filteredData, setFilteredData] = useState<TicketData[] | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<TicketData[] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [columnMapping, setColumnMapping] = useState<
    Record<string, string | null>
  >({});
  const [columnLabels, setColumnLabels] = useState<
    Record<string, string | null>
  >({});

  const [filters, setFilters] = useState<FilterState>({
    uploadedFile: null,
    startDate: null, // <-- set to null
    endDate: null,   // <-- set to null
    technology: ["All"],
    client: ["All"],
    ticketType: ["All"],
    assignedTo: ["All"],
    status: ["All"],
    ticketNumber: ["All"],
    site: ["All"],
    configurationItem: ["All"],
    createdBy: ["All"],
    assignmentGroup: ["All"],
    priority: ["All"],
    closedBy: ["All"],
  });

  const [uniqueValues, setUniqueValues] = useState<Record<string, string[]>>({
    technology: ["All"],
    client: ["All"],
    ticketType: ["All"],
    assignedTo: ["All"],
    status: ["All"],
    ticketNumber: ["All"],
    site: ["All"],
    configurationItem: ["All"],
    createdBy: ["All"],
    assignmentGroup: ["All"],
    priority: ["All"],
    closedBy: ["All"],
  });

  const normalize = (val: string): string =>
    val?.toString().toLowerCase().trim();

  const extractUniqueValues = (data: TicketData[]) => {
    const unique: Record<string, string[]> = {
      technology: ["All"],
      client: ["All"],
      ticketType: ["All"],
      assignedTo: ["All"],
      status: ["All"],
      ticketNumber: ["All"],
      site: ["All"],
      configurationItem: ["All"],
      createdBy: ["All"],
      assignmentGroup: ["All"],
      priority: ["All"],
      closedBy: ["All"],
    };
    data.forEach((ticket) => {
      (Object.keys(unique) as Array<keyof typeof unique>).forEach((key) => {
        const value = (
          ticket[key] ||
          ticket[key.charAt(0).toUpperCase() + key.slice(1)] ||
          ""
        )
          .toString()
          .trim();
        if (value && !unique[key].includes(value)) {
          unique[key].push(value);
        }
      });
    });
    console.log("Extracted unique values:", unique);
    return unique;
  };

  const processRawData = (
    data: any[],
    mapping: Record<string, string | null>
  ): TicketData[] => {
    console.log("processRawData called with mapping:", mapping);
    console.log("Sample raw data:", data.slice(0, 1));

    const processed = data.map((row, index) => {
      const ticket: TicketData = {
        id: row[mapping.ticketNumber || "ID"] || `ticket-${index}`,
        ticketNumber: (
          row[mapping.ticketNumber || "Ticket Number"] || "Unknown"
        )
          .toString()
          .trim(),
        date: row[mapping.startDate || "Assigned Date"] || "Unknown",
        technology: (
          row[mapping.technology || "Technology/Platform"] || "Unknown"
        )
          .toString()
          .trim(),
        client: (row[mapping.customer || "Client"] || "Unknown")
          .toString()
          .trim(),
        ticketType: (row[mapping.ticketType || "Ticket Type"] || "Unknown")
          .toString()
          .trim(),
        assignedTo: (
          row[mapping.assignedTo || "Assigned to"] ||
          row[mapping.assignedTo || "AssignedTo"] ||
          "Unassigned"
        )
          .toString()
          .trim(),
        status: row[mapping.state || "Status"] || "Unknown",
        site: (row[mapping.site || "Site"] || "").toString().trim(),
        configurationItem:
          (
            row[mapping.configurationItem || "Configuration Item"] ||
            row["configurationItem"] ||
            row["Configuration Item"] ||
            "Unknown"
          )
            .toString()
            .trim(),
        createdBy: (row[mapping.createdBy || "Created By"] || "")
          .toString()
          .trim(),
        assignmentGroup: (
          row[mapping.assignmentGroup || "Assignment Group"] || ""
        )
          .toString()
          .trim(),
        priority: (row[mapping.priority || "Priority"] || "").toString().trim(),
        closedBy: (row[mapping.closedBy || "Closed By"] || "")
          .toString()
          .trim(),
        responseTime: null,
        satisfaction: null,
        ...row,
      };

      if (index < 2) {
        console.log(`Processed ticket ${index}:`, ticket);
      }

      return ticket;
    });

    console.log("Total processed tickets:", processed.length);
    return processed;
  };

  const applyFilters = useCallback(
    (filtersToApply?: FilterState) => {
      if (!processedData) return;

      const current = filtersToApply || filters;

      const filtered = processedData.filter((ticket) => {
        const ticketDate = new Date(ticket.date);

        return (
          ticketDate >= current.startDate &&
          ticketDate <= current.endDate &&
          (current.technology.includes("All") ||
            current.technology
              .map(normalize)
              .includes(normalize(ticket.technology))) &&
          (current.client.includes("All") ||
            current.client.map(normalize).includes(normalize(ticket.client))) &&
          (current.ticketType.includes("All") ||
            current.ticketType
              .map(normalize)
              .includes(normalize(ticket.ticketType))) &&
          (current.assignedTo.includes("All") ||
            current.assignedTo
              .map(normalize)
              .includes(normalize(ticket.assignedTo))) &&
          (current.status.includes("All") ||
            current.status.map(normalize).includes(normalize(ticket.status))) &&
          (current.ticketNumber.includes("All") ||
            current.ticketNumber.includes(ticket.ticketNumber))
        );
      });

      setFilteredData(filtered);
      setSelectedTickets(null);
      setSelectedCategory(null);
      setSelectedValue(null);

      const updatedUnique = extractUniqueValues(filtered);
      setUniqueValues(updatedUnique);

      // Check if no data is available after filtering
      if (filtered.length === 0 && processedData.length > 0) {
        const activeFilters: string[] = [];

        // Check which filters are active (not 'All')
        if (!current.technology.includes("All")) {
          activeFilters.push(`Technology: ${current.technology.join(", ")}`);
        }
        if (!current.client.includes("All")) {
          activeFilters.push(`Client: ${current.client.join(", ")}`);
        }
        if (!current.ticketType.includes("All")) {
          activeFilters.push(`Ticket Type: ${current.ticketType.join(", ")}`);
        }
        if (!current.assignedTo.includes("All")) {
          activeFilters.push(`Assigned To: ${current.assignedTo.join(", ")}`);
        }
        if (!current.status.includes("All")) {
          activeFilters.push(`Status: ${current.status.join(", ")}`);
        }
        if (!current.ticketNumber.includes("All")) {
          activeFilters.push(
            `Ticket Number: ${current.ticketNumber.join(", ")}`
          );
        }

        const dateRange = `${new Date(
          current.startDate
        ).toLocaleDateString()} - ${new Date(
          current.endDate
        ).toLocaleDateString()}`;

        let message = `No data found for the selected date range: ${dateRange}`;
        if (activeFilters.length > 0) {
          message += ` and filters: ${activeFilters.join(", ")}`;
        }
        message += ". Please adjust your filters or date range.";

        toast.error("No Data Available", {
          description: message,
          duration: 5000,
        });
      }
    },
    [filters, processedData]
  );

  const updateFilters = (
    newFilters: Partial<FilterState>,
    applyImmediately = false
  ) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      if (applyImmediately) applyFilters(updated);
      return updated;
    });
  };

  const resetFilters = () => {
    const reset: FilterState = {
      uploadedFile: null,
      startDate: null, // <-- set to null
      endDate: null,   // <-- set to null
      technology: ["All"],
      client: ["All"],
      ticketType: ["All"],
      assignedTo: ["All"],
      status: ["All"],
      ticketNumber: ["All"],
      site: ["All"],
      configurationItem: ["All"],
      createdBy: ["All"],
      assignmentGroup: ["All"],
      priority: ["All"],
      closedBy: ["All"],
    };
    setFilters(reset);
    setFilteredData(processedData);
    setUniqueValues(extractUniqueValues(processedData || []));
  };

  const loadExcelData = (data: any[]) => {
    console.log("loadExcelData called with data length:", data.length);
    console.log("Sample data:", data.slice(0, 2));

    setIsLoading(true);
    // Get headers from first row
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    console.log("Headers from data:", headers);

    const { mapping, labels } = mapExcelColumns(headers);
    console.log("Column mapping result:", mapping);
    console.log("Column labels result:", labels);

    setColumnMapping(mapping);
    setColumnLabels(labels);
    const processed = processRawData(data, mapping);
    console.log("Processed data length:", processed.length);
    console.log("Sample processed data:", processed.slice(0, 2));

    const unique = extractUniqueValues(processed);
    console.log("Unique values extracted:", unique);

    setRawData(data);
    setAllData(processed); // ✅ populate allData
    setProcessedData(processed);
    setUniqueValues(unique);

    // Check if processed data is empty
    if (processed.length === 0) {
      toast.error("No Valid Data Found", {
        description:
          "The uploaded file contains no valid ticket data. Please check your file format and try again.",
        duration: 5000,
      });
    }

    applyFilters({
      ...filters,
      technology: ["All"],
      client: ["All"],
      ticketType: ["All"],
      assignedTo: ["All"],
      status: ["All"],
      ticketNumber: ["All"],
    });
    setIsLoading(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

const normalizeDateIfDateCategory = (category: string, value: string | Date) => {
  if (category !== "date" || !value) return normalize(value?.toString?.() ?? "");

  let dateObj: Date;
  if (value instanceof Date) {
    dateObj = value;
  } else {
    dateObj = new Date(value.replace(/-/g, "/"));
  }
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};


 const selectTicketsByCategory = (
  category: string,
  values: string[] | string
) => {
  if (!filteredData) return;

  const normalizedValues = Array.isArray(values)
    ? values.map(v => normalizeDateIfDateCategory(category, v))
    : [normalizeDateIfDateCategory(category, values)];

  const tickets = filteredData.filter((item) => {
    let itemValue: string = "";

    if (category === "date") {
      itemValue = normalizeDateIfDateCategory(category, item[category]);
    } else if (category === "configurationItem") {
      itemValue =
        normalize(item["configurationItem"]) ||
        normalize(item["Configuration Item"]) ||
        "unknown";
    } else {
      itemValue = normalize(item[category]);
    }

    return normalizedValues.includes(itemValue);
  });

  console.log("DASHBOARD FILTEREDDATA:::", filteredData);
  console.log("DASHBOARD VALUES:::", values);
  console.log("DASHBOARD TICKETS:::", tickets);
  console.log("DASHBOARD CATEGORY:::", category);

  setSelectedTickets(tickets);
  setSelectedCategory(category);
  setSelectedValue(Array.isArray(values) ? values.join(", ") : values);
  setIsPanelOpen(true);
};


  const clearSelectedTickets = () => {
    setSelectedTickets(null);
    setSelectedCategory(null);
    setSelectedValue(null);
    setIsPanelOpen(false);
  };

  const togglePanel = () => setIsPanelOpen((prev) => !prev);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = storedMode !== null ? JSON.parse(storedMode) : prefersDark;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        rawData,
        allData, // ✅ exposed
        processedData,
        filteredData,
        selectedTickets,
        selectedCategory,
        selectedValue,
        filters,
        uniqueValues,
        isLoading,
        isDarkMode,
        isPanelOpen,
        updateFilters,
        resetFilters,
        applyFilters,
        loadExcelData,
        toggleDarkMode,
        selectTicketsByCategory,
        clearSelectedTickets,
        togglePanel,
        setSelectedTickets,
        setSelectedCategory,
        setSelectedValue,
        columnMapping,
        columnLabels,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};
