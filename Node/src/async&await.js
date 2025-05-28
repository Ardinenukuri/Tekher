//asyc & await

async function fetchdata(){
    const response = await
        fetch('https://jsonplaceholder.typicode.com/users.json');
    const data = await response.json();
    console.log(data)
}

fetchdata();

//syntax
async function functionName() {
    try {
        const result = await someAsyncFunction();
        console.log(result);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

//Async Function
const getdata = async () =>{
    let data ='hello world';
    return(data)
}
getdata().then(data => console.log(data))

//await keyword
const getdata = async() =>{
    let x = await 'hello world';
    console.log(x)
}

//Error Handling in Async/Await
async function fetchData() {
    try {
        let response = await fetch('https://api.example.com/data');
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// //async function in typescript
// fetchData returns a promise, and fetchDataAsync is an asynchronous function that uses await to wait for the promise to be resolved. The try/catch block handles any errors that might occur during the asynchronous operation.

// Function returning a promise
function fetchData(): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Async data has been fetched!");
        }, 2000);
    });
}

// Async function using await to handle the promise
async function fetchDataAsync(): Promise<void> {
    try {
        const result = await fetchData();
        console.log(result); // Output: Async data has been fetched!
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the async function
fetchDataAsync();

// Type-safe Promise creation
interface ApiResponse {
    data: string;
    timestamp: number;
}

const fetchData = new Promise<ApiResponse>((resolve, reject) => {
    try {
        // Simulating API call
        setTimeout(() => {
            resolve({
                data: "Success!",
                timestamp: Date.now()
            });
        }, 1000);
    } catch (error) {
        reject(error);
    }
});

// Promises can be chained using .then() for successful operations and .catch() for error handling:

    fetchData
        .then(response => {
            console.log(response.data);  // TypeScript knows response has ApiResponse type
            return response.timestamp;
        })
        .then(timestamp => {
            console.log(new Date(timestamp).toISOString());
        })
        .catch(error => {
            console.error('Error:', error);
        });

//example: I have a lawn to mow. I contact a mowing company that promises to mow my lawn in a couple of hours.
// In turn, I promise to pay them immediately afterward, provided the lawn is properly mowed. The first obvious thing to note is that the second event relies entirely on the previous one.
// If the first event’s promise is fulfilled, the next event’s will be executed.
// I send a request to the company. This is synchronous
// company replies with a promise

interface Record {
    amount: number;
    note: string;
}
const angelMowersPromise = new Promise<string>((resolve, reject) => {
    // a resolved promise after certain hours
    setTimeout(() => {
        resolve('We finished mowing the lawn')
    }, 100000) // resolves after 100,000ms
    reject("We couldn't mow the lawn")
})

angelMowersPromise
    .then(() => myPaymentPromise.then(res => console.log(res)))
    .catch(error => console.log(error))

const myPaymentPromise = new Promise<Record>((resolve, reject) => {
    // a resolved promise with  an object of 1000 Euro payment
    // and a thank you message
    setTimeout(() => {
        resolve({
            amount: 1000,
            note: 'Thank You',
        })
    }, 100000)
    // reject with 0 Euro and an unstatisfatory note
    reject({
        amount: 0,
        note: 'Sorry Lawn was not properly Mowed',
    })
})

//higher-order function
// Async function to fetch employee data
async function fetchEmployees(apiUrl: string): Promise<Employee[]> {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Wrapped version of fetchEmployees using the higher-order function
const safeFetchEmployees = (url: string) => handleAsyncErrors(fetchEmployees, url);

// Example API URL
const api = 'http://dummy.restapiexample.com/api/v1/employees';

// Using the wrapped function to fetch employees
safeFetchEmployees(api)
    .then(data => {
        if (data) {
            console.log("Fetched employee data:", data);
        } else {
            console.log("Failed to fetch employee data.");
        }
    })
    .catch(err => {
        // This catch block might be redundant, depending on your error handling strategy within the higher-order function
        console.error("Error in safeFetchEmployees:", err);
    });

//promise all
// Fetch all users => /employee
// Wait for all user data. Extract the id from each user. Fetch each user => /employee/{id}
// Generate an email for each user from their username
const baseApi = 'https://reqres.in/api/users?page=1'
const userApi = 'https://reqres.in/api/user'

const fetchAllEmployees = async (url: string): Promise<Employee[]> => {
    const response = await fetch(url)
    const { data } = await response.json()
    return data
}

const fetchEmployee = async (url: string, id: number): Promise<Record<string, string>> => {
    const response = await fetch(`${url}/${id}`)
    const { data } = await response.json()
    return data
}
const generateEmail = (name: string): string => {
    return `${name.split(' ').join('.')}@company.com`
}

const runAsyncFunctions = async () => {
    try {
        const employees = await fetchAllEmployees(baseApi)
        Promise.all(
            employees.map(async user => {
                const userName = await fetchEmployee(userApi, user.id)
                const emails = generateEmail(userName.name)
                return emails
            })
        )
    } catch (error) {
        console.log(error)
    }
}
runAsyncFunctions()

//promise.allsettled

interface UpdateResult {
    id: number;
    success: boolean;
    message: string;
}

const updateEmployee = async (employee: Employee): Promise<UpdateResult> => {
    const api = `${userApi}/${employee.id}`;
    try {
        const response = await fetch(api, {
            method: 'PUT',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return {
            id: employee.id,
            success: true,
            message: 'Update successful'
        };
    } catch (error) {
        return {
            id: employee.id,
            success: false,
            message: error instanceof Error ? error.message : 'Update failed'
        };
    }
};

const bulkUpdateEmployees = async (employees: Employee[]) => {
    const updatePromises = employees.map(emp => updateEmployee(emp));

    const results = await Promise.allSettled(updatePromises);

    // Process results and generate a report
    const summary = results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled') {
            acc.successful.push(result.value);
        } else {
            acc.failed.push({
                id: employees[index].id,
                error: result.reason
            });
        }
        return acc;
    }, {
        successful: [] as UpdateResult[],
        failed: [] as Array<{id: number; error: any}>
    });

    return summary;
};