# trimble-unity

A JavaScript/TypeScript API wrapper for the **Trimble Unity** SaaS platform, covering both products in the suite:

- **Trimble Unity Construct** (formerly e-Builder) — capital project management
- **Trimble Unity Maintain** (formerly Cityworks) — asset and work order management

Follows the same patterns and best practices as the [Cityworks npm API wrapper](https://github.com/walker/cityworks).

---

## Installation

```sh
npm install trimble-unity
```

---

## Usage

```js
const tu = require('trimble-unity')
// or
import * as tu from 'trimble-unity'
```

---

## Trimble Unity Construct

Wraps the e-Builder / Construct REST API (`https://api2.e-builder.net`).

### Configure and authenticate

```js
tu.TrimbleUnity.configure('api2.e-builder.net')

tu.TrimbleUnity.authenticate('your@email.com', 'yourpassword').then(() => {
  console.log('Authenticated!')
}).catch(err => {
  console.error(err.message)
})
```

Store/restore a token from a session:

```js
const token = tu.TrimbleUnity.getToken()
// later...
tu.TrimbleUnity.setToken(token)
```

### Construct modules

#### Projects

```js
tu.project.getAll()
tu.project.getById(projectId)
tu.project.query({ Name: 'Highway', Status: 'Active' })
tu.project.getBudgetLineItems(projectId)
tu.project.getCommitments(projectId)
tu.project.getContacts(projectId)
tu.project.getProcesses(projectId)
tu.project.getDocuments(projectId)
```

#### Budgets

```js
tu.budget.getAll()
tu.budget.getById(budgetId)
tu.budget.getLineItems(budgetId)
tu.budget.getTransactions(budgetId)
tu.budget.getAdjustments(budgetId)
```

#### Commitments

```js
tu.commitment.getAll()
tu.commitment.getById(commitmentId)
tu.commitment.getItems(commitmentId)
tu.commitment.getChanges(commitmentId)
tu.commitment.getInvoices(commitmentId)
```

#### Invoices (Commitment & General)

```js
tu.invoice.getAll()
tu.invoice.getById(invoiceId)
tu.invoice.getAllGeneral()
tu.invoice.getGeneralById(invoiceId)
```

#### Companies

```js
tu.company.getAll()
tu.company.getById(companyId)
tu.company.getContacts(companyId)
tu.company.getProjects(companyId)
```

#### Contacts

```js
tu.contact.getAll()
tu.contact.getById(contactId)
tu.contact.getProjects(contactId)
```

#### Documents

```js
tu.document.getAll()
tu.document.getByProject(projectId)
tu.document.getVersions(documentId)
```

#### Account Funding Sources

```js
tu.funding_source.getAll()
tu.funding_source.getDistributions(fundingSourceId)
tu.funding_source.getTransactions(fundingSourceId)
```

#### Processes

```js
tu.process.getAll()
tu.process.getByProject(projectId)
tu.process.getSteps(processId)
```

---

## Trimble Unity Maintain

Wraps the Cityworks REST API as hosted in the Trimble Unity Maintain SaaS platform.

### Configure and authenticate

**Cityworks Online / Unity Maintain SaaS** (default):

```js
tu.maintain.tu_maintain.configure('cityworksonline')

tu.maintain.tu_maintain.authenticate('yourlogin', 'yourpassword').then(() => {
  console.log('Authenticated!')
}).catch(err => {
  console.error(err.message)
})
```

**On-premises Cityworks** server:

```js
tu.maintain.tu_maintain.configure('cityworks.yourorg.com', {
  path: 'cityworks',
  version: 23,
  secure: true
})
await tu.maintain.tu_maintain.authenticate('yourlogin', 'yourpassword')
```

Store/restore a token:

```js
const token = tu.maintain.tu_maintain.getToken()
tu.maintain.tu_maintain.setToken(token)
```

### Maintain modules

#### Work Orders (AMS)

```js
tu.maintain.workorder.search({ Status: 'Open', EntityType: 'WATER_MAIN' })
tu.maintain.workorder.getById([woid1, woid2])
tu.maintain.workorder.create({ EntityType: 'WATER_MAIN', Description: 'Fix leak' })
tu.maintain.workorder.update({ WorkOrderSID: 1234, Status: 'Closed' })
tu.maintain.workorder.close([1234])
tu.maintain.workorder.getComments(1234)
tu.maintain.workorder.addComment(1234, 'Work completed.')
tu.maintain.workorder.getTasks(1234)
tu.maintain.workorder.getEntities(1234)
tu.maintain.workorder.getEntityTypes()
```

#### Inspections (AMS)

```js
tu.maintain.inspection.search({ EntityType: 'SEWER_MAIN', Status: 'Open' })
tu.maintain.inspection.getById([inspId])
tu.maintain.inspection.create({ EntityType: 'SEWER_MAIN', EntityUID: 'ABC123' })
tu.maintain.inspection.getResults(inspId)
tu.maintain.inspection.getEntityTypes()
```

#### Service Requests (AMS)

```js
tu.maintain.service_request.search({ ProblemCode: 'POTHOLE' })
tu.maintain.service_request.getById([reqId])
tu.maintain.service_request.create({ ProblemCode: 'POTHOLE', Description: 'Large pothole on Main St' })
tu.maintain.service_request.getLinkedWorkOrders(reqId)
tu.maintain.service_request.linkWorkOrder(reqId, woid)
tu.maintain.service_request.getProblemCodes()
```

#### Assets (GIS)

```js
tu.maintain.asset.search('WATER_MAIN')
tu.maintain.asset.search('WATER_MAIN', ['UID001', 'UID002'])
tu.maintain.asset.getWorkOrders('WATER_MAIN', 'UID001')
tu.maintain.asset.getInspections('SEWER_MAIN', 'UID002')
tu.maintain.asset.getHistory('WATER_MAIN', 'UID001')
tu.maintain.asset.getEntityTypes()
```

#### Employees

```js
tu.maintain.employee.current()
tu.maintain.employee.getById([empSid])
tu.maintain.employee.search({ FullName: 'Smith' })
tu.maintain.employee.getAll()
tu.maintain.employee.getGroups(empSid)
tu.maintain.employee.getWorkOrders(empSid)
```

#### Costs (Labor / Material / Equipment)

```js
// Work order costs
tu.maintain.cost.getWorkOrderLabor(woid)
tu.maintain.cost.addWorkOrderLabor({ WorkOrderSID: woid, EmployeeSID: empSid, Hours: 4 })
tu.maintain.cost.getWorkOrderMaterial(woid)
tu.maintain.cost.getWorkOrderEquipment(woid)

// Inspection costs
tu.maintain.cost.getInspectionLabor(inspId)
tu.maintain.cost.addInspectionLabor({ InspectionSID: inspId, Hours: 2 })

// Service request costs
tu.maintain.cost.getServiceRequestLabor(reqId)
```

---

## Error handling

All methods return Promises. Errors are instances of `TUError` with `code`, `message`, and optional `data` fields:

```js
tu.maintain.workorder.search({ Status: 'Open' }).catch(err => {
  console.error(`Error ${err.code}: ${err.message}`)
})
```

---

## Environment variables (for testing)

Copy `dotenv` to `.env` and fill in your credentials:

```
# Trimble Unity Construct (e-Builder)
TUHOST=api2.e-builder.net
TULOGIN=your@email.com
TUPASSWORD=yourpassword

# Trimble Unity Maintain (Cityworks)
MAINTAIN_HOST=cityworksonline
MAINTAIN_LOGIN=your.login
MAINTAIN_PASSWORD=yourpassword
```

---

## Building

```sh
npm run build
```

## Testing

```sh
npm test
```

## API documentation

```sh
npm run docs
```
