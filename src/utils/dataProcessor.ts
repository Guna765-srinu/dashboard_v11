
import { read, utils } from 'xlsx';

/**
 * Parses an Excel file and returns the data as an array of objects
 * @param file - The Excel file to parse
 * @returns Promise that resolves to an array of objects representing the Excel data
 */
export const parseExcelFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        console.log('File loaded, size:', file.size, 'bytes');
        console.log('File name:', file.name);
        
        const workbook = read(data, { type: 'binary' });
        console.log('Workbook sheets:', workbook.SheetNames);
        
        // Assume first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        console.log('Using sheet:', firstSheetName);
        
        // Convert to JSON with headers
        const jsonData = utils.sheet_to_json(worksheet, { 
          header: 'A',
          range: 0,
          raw: false,
          defval: null
        });
        
        console.log('Raw JSON data length:', jsonData.length);
        console.log('First few rows of raw data:', jsonData.slice(0, 3));
        
        // Get headers from the first row
        const headers = jsonData[0];
        console.log('Headers found:', headers);
        
        // Remove header row and map data to objects with proper keys
        const result = jsonData.slice(1).map((row: any) => {
          const obj: any = {};
          Object.keys(row).forEach((key) => {
            const header = headers[key];
            if (header) {
              obj[header] = row[key];
            }
          });
          return obj;
        });
        
        console.log('Final processed data length:', result.length);
        console.log('Sample processed data:', result.slice(0, 2));
        console.log('Available columns in processed data:', result.length > 0 ? Object.keys(result[0]) : []);
        
        resolve(result);
      } catch (error) {
        console.error('Error in parseExcelFile:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};
/**
  data processing for the open and lcosed tickets 
 */


/**
 * Calculates metrics from ticket data
 * @param data - Array of ticket data
 * @returns Object containing calculated metrics
 */
export const calculateMetrics = (data: any[]) => {
  if (!data || data.length === 0) {
    return {
      totalTickets: 0,
      openTickets: 0,
      resolvedTickets: 0
    };
  }

  const totalTickets = data.length;

  const openStatuses = ['open', 'in review', 'hold', 'in progress'];
  const resolvedStatuses = ['closed'];

  const openTickets = data.filter(item => {
    const status = (item.Status || item.status || '').toLowerCase();
    return openStatuses.includes(status);
  }).length;

  const resolvedTickets = data.filter(item => {
    const status = (item.Status || item.status || '').toLowerCase();
    return resolvedStatuses.includes(status);
  }).length;

  return {
    totalTickets,
    openTickets,
    resolvedTickets
  };
};



/**
 * Prepare data for time series chart
 * @param data - Array of ticket data
 * @returns Prepared data for time series chart
 */
export const prepareTimeSeriesData = (data: any[]) => {
  if (!data || data.length === 0) return [];
  
  // Group tickets by date - look for both 'Date' and 'date' fields
  const ticketsByDate: Record<string, number> = {};
  
  data.forEach(ticket => {
    const dateValue = ticket.Date || ticket.date;
    if (dateValue) {
      // Format the date as YYYY-MM-DD
      const dateKey = new Date(dateValue).toISOString().split('T')[0];
      
      if (ticketsByDate[dateKey]) {
        ticketsByDate[dateKey]++;
      } else {
        ticketsByDate[dateKey] = 1;
      }
    }
  });
  
  // Convert to array format for chart
  return Object.entries(ticketsByDate)
    .map(([date, count]) => ({ 
      date, 
      tickets: count 
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Prepare data for categorical charts (bar, pie, etc)
 * @param data - Array of ticket data
 * @param category - The category to group by
 * @returns Prepared data for categorical chart
 */
export const prepareCategoryData = (data: any[], category: string, columnLabels?: Record<string, string | null>, columnMapping?: Record<string, string | null>) => {
  if (!data || data.length === 0) return [];

  // Debug logging for ticket type
  if (category === 'ticketType' || category === 'type') {
    console.log('Processing ticket type data with category:', category);
    console.log('Column mapping for ticketType:', columnMapping?.ticketType);
    console.log('Column labels for ticketType:', columnLabels?.ticketType);
    console.log('Sample ticket data:', data.slice(0, 2));
  }

  // Group tickets by the specified category
  const ticketsByCategory: Record<string, number> = {};



  // Try to resolve the actual field name in the data
  let field = category;
  let actualColumnName = null;
  
  if (columnLabels && columnMapping) {
    // First, try to find the dashboard field whose label matches the category
    const dashboardField = Object.keys(columnLabels).find(key => columnLabels[key] === category);
    if (dashboardField && columnMapping[dashboardField]) {
      field = dashboardField;
      actualColumnName = columnMapping[dashboardField];
    } else {
      // If not found by label, try to find by field name directly
      if (columnMapping[category]) {
        field = category;
        actualColumnName = columnMapping[category];
      }
    }
  }
  


  data.forEach(ticket => {
    let categoryValue;
    
    // First, try to use the actual column name from mapping
    if (actualColumnName && ticket[actualColumnName] !== undefined) {
      categoryValue = ticket[actualColumnName];
    } else if (ticket[field] !== undefined) {
      categoryValue = ticket[field];
    } else {
      // Fallback to previous logic
      if (field === 'technology') {
        categoryValue = ticket['Technology/Platform'] || ticket.Technology || ticket.technology;
      } else if (field === 'assignedTo') {
        categoryValue = ticket['Assigned to'] || ticket.AssignedTo || ticket['Assigned To'] || ticket.assignedTo;
      } else if (field === 'ticketType' || field === 'type') {
        categoryValue = ticket['Type'] || ticket.type || ticket['Ticket Type'] || ticket.ticketType || 
                       ticket['Incident Type'] || ticket['Issue Type'] || ticket['Category'] || 
                       ticket['Request Category'] || ticket['Request Type'] || ticket.incidentType || 
                       ticket.issueType || ticket.category || ticket.requestCategory || ticket.requestType;
      } else if (field === 'closedBy') {
        categoryValue = ticket['Closed by'] || ticket.closedBy || ticket['Closed By'] || ticket['closed by'];
      } else if (field === 'assignmentGroup') {
        categoryValue = ticket['Assignment Group'] || ticket['Assignment group'] || ticket.assignmentGroup || ticket['assignment group'];
      } else if (field === 'priority') {
        categoryValue = ticket['Priority'] || ticket.priority;
      } else if (field === 'customer') {
        categoryValue = ticket['Client'] || ticket['Customer'] || ticket['Site'] || ticket.client || ticket.customer || ticket.site;
      } else if (field === 'configurationItem') {
        categoryValue = ticket['Configuration Item'] || ticket['Configuration item'] || ticket.configurationItem || ticket['configuration item'] || ticket['CI'];
      } else {
        categoryValue = ticket[field];
        if (categoryValue === undefined) {
          categoryValue = ticket[field.toLowerCase()];
        }
        if (categoryValue === undefined) {
          const spaced = field.replace(/([A-Z])/g, ' $1').trim();
          const capitalized = spaced.charAt(0).toUpperCase() + spaced.slice(1);
          categoryValue = ticket[capitalized];
        }
        if (categoryValue === undefined && field.includes(' ')) {
          const camelCase = field.replace(/ ([a-z])/g, (match) => match[1].toUpperCase());
          categoryValue = ticket[camelCase];
        }
      }
    }
    // Normalize to a string or use 'Unknown'
    const value = (categoryValue !== undefined && categoryValue !== null && categoryValue !== '')
      ? String(categoryValue)
      : 'Unknown';
    

    
    if (ticketsByCategory[value]) {
      ticketsByCategory[value]++;
    } else {
      ticketsByCategory[value] = 1;
    }
  });
  // Convert to array format for chart
  const result = Object.entries(ticketsByCategory)
    .map(([name, value]) => ({ 
      name, 
      value 
    }));
  
  return result;
};

/**
 * Normalizes and maps column headers to target fields using a lookup dictionary and fuzzy match logic.
 * Returns both the mapping for data access and the display label for UI.
 * @param headers - Array of column headers from the Excel file
 * @returns { mapping: Record<string, string|null>, labels: Record<string, string|null> }
 */
export function mapExcelColumns(headers: string[]): { mapping: Record<string, string | null>, labels: Record<string, string | null> } {
  console.log('Mapping columns for headers:', headers);
  
  // Lookup dictionary: dashboard field -> possible header names (lowercased, trimmed)
  const lookup: Record<string, string[]> = {
    startDate: ['start date', 'created', 'planned start date'],
    endDate: ['end date', 'closed', 'planned end date'],
    assignedTo: ['assigned to', 'assignedto', 'assigned_to'],
    customer: ['customer', 'client', 'site'],
    assignmentGroup: ['assignment group', 'group'],
    state: ['state', 'status'],
    priority: ['priority'],
    createdBy: ['created by', 'creator'],
    closedBy: ['closed by', 'closer'],
    technology: ['technology', 'technology/platform'],
    configurationItem: ['configuration item', 'configuration', 'ci', 'config item'],
    ticketType: ['ticket type', 'request type', 'type', 'incident type', 'issue type', 'category', 'request category'],
    ticketNumber: ['ticket number', 'number', 'id', 'ticket id'],
  };

  // Normalize a string for comparison
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, ' ').trim();

  // Build a normalized header map: normalized -> original
  const normalizedHeaderMap: Record<string, string> = {};
  headers.forEach(h => {
    normalizedHeaderMap[normalize(h)] = h;
  });
  
  console.log('Normalized header map:', normalizedHeaderMap);

  // Result: dashboard field -> actual column name (or null if not found)
  const mapping: Record<string, string | null> = {};
  const labels: Record<string, string | null> = {};
  Object.entries(lookup).forEach(([field, possibleNames]) => {
    // Try to find a matching header
    let found: string | null = null;
    let label: string | null = null;
    for (const name of possibleNames) {
      if (normalizedHeaderMap[name]) {
        found = normalizedHeaderMap[name];
        label = normalizedHeaderMap[name];
        break;
      }
      // Fuzzy: allow partial match (e.g., 'created' matches 'created date')
      const match = Object.keys(normalizedHeaderMap).find(h => h.includes(name));
      if (match) {
        found = normalizedHeaderMap[match];
        label = normalizedHeaderMap[match];
        break;
      }
    }
    // Special logic for customer/client/site: prefer 'Client' if present
    if (field === 'customer') {
      if (headers.includes('Client')) {
        found = 'Client';
        label = 'Client';
      } else if (headers.includes('Customer')) {
        found = 'Customer';
        label = 'Customer';
      } else if (headers.includes('Site')) {
        found = 'Site';
        label = 'Site';
      }
    }
    // For technology, use the actual column name found
    if (field === 'technology' && found) {
      label = found;
    }
    // For assignmentGroup, use the actual column name found
    if (field === 'assignmentGroup' && found) {
      label = found;
    }
    // For assignedTo, use the actual column name found
    if (field === 'assignedTo' && found) {
      label = found;
    }
    // For createdBy, use the actual column name found
    if (field === 'createdBy' && found) {
      label = found;
    }
    // For priority, use the actual column name found
    if (field === 'priority' && found) {
      label = found;
    }
    mapping[field] = found;
    labels[field] = label;
  });
  
  console.log('Final column mapping:', mapping);
  console.log('Final column labels:', labels);
  
  return { mapping, labels };
}