// Service Worker for Leave Balance
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Function to extract balances from HTML
function extractBalances(doc) {
  const balances = {
    CL: '0.00',
    EL: '0.00',
    SL: '0.00'
  };

  try {
    // Method 1: Direct table search
    const tables = doc.getElementsByTagName('table');
    for (const table of tables) {
      if (table.textContent.includes('Current Year Leave Balance')) {
        const rows = table.getElementsByTagName('tr');
        for (const row of rows) {
          const cells = row.getElementsByTagName('td');
          if (cells.length >= 4) {
            const leaveType = cells[0].textContent.trim();
            const balance = cells[3].textContent.trim();
            if (leaveType === 'CL') balances.CL = balance;
            if (leaveType === 'EL') balances.EL = balance;
            if (leaveType === 'SL') balances.SL = balance;
          }
        }
        return balances;
      }
    }

    // Method 2: Try ASP.NET controls
    const controls = {
      CL: ['ctl00_ContentPlaceHolder1_lblCLBal', 'ContentPlaceHolder1_lblCLBal'],
      EL: ['ctl00_ContentPlaceHolder1_lblELBal', 'ContentPlaceHolder1_lblELBal'],
      SL: ['ctl00_ContentPlaceHolder1_lblSLBal', 'ContentPlaceHolder1_lblSLBal']
    };

    for (const [type, ids] of Object.entries(controls)) {
      for (const id of ids) {
        const element = doc.getElementById(id);
        if (element) {
          const value = element.textContent.trim();
          if (value && !isNaN(parseFloat(value))) {
            balances[type] = value;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting balances:', error);
  }

  return balances;
}

// Function to fetch and parse leave balance
async function fetchLeaveBalance(retryCount = 0) {
  const maxRetries = 3;
  const urls = [
    'https://portal.dodladairy.com/lms/pgleaveapplicationnew.aspx',
    'https://portal.dodladairy.com/lms/LeaveApplicationNew.aspx'
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        console.log(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        continue;
      }

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      // Extract balances
      const balances = extractBalances(doc);
      
      // Check if we got any non-zero balances
      if (Object.values(balances).some(val => val !== '0.00')) {
        // Broadcast the balances to all clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'leaveBalance',
            balances: balances
          });
        });
        return;
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }

  // If we reach here, all attempts failed
  if (retryCount < maxRetries) {
    console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
    setTimeout(() => fetchLeaveBalance(retryCount + 1), 2000);
  }
}

// Listen for messages from the main page
self.addEventListener('message', (event) => {
  if (event.data === 'fetchLeaveBalance') {
    fetchLeaveBalance();
  }
});

// Fetch leave balance every 30 seconds
setInterval(fetchLeaveBalance, 30000);
