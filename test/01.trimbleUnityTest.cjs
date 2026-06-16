'use strict'

const { expect } = require('chai')
const tu = require('../dist/index.js')

// Optional: load .env if present (won't fail if missing)
try {
  require('dotenv').config()
} catch (_) {}

/**
 * Unit tests for trimble-unity package.
 *
 * Live API tests (authenticate/runRequest) are skipped unless
 * TUHOST / TULOGIN / TUPASSWORD env vars are set.
 *
 * MAINTAIN_ prefixed vars enable Unity Maintain live tests.
 */

describe('trimble-unity package', function () {
  // ─── Package shape ─────────────────────────────────────────────────────────

  describe('exports', function () {
    it('exports TrimbleUnity (Construct) instance', function () {
      expect(tu.TrimbleUnity).to.be.an('object')
    })

    it('exports maintain namespace', function () {
      expect(tu.maintain).to.be.an('object')
    })

    it('exports all Construct service modules', function () {
      expect(tu.project).to.be.an('object')
      expect(tu.budget).to.be.an('object')
      expect(tu.commitment).to.be.an('object')
      expect(tu.invoice).to.be.an('object')
      expect(tu.company).to.be.an('object')
      expect(tu.contact).to.be.an('object')
      expect(tu.document).to.be.an('object')
      expect(tu.funding_source).to.be.an('object')
      expect(tu.process).to.be.an('object')
    })

    it('exports all Maintain service modules inside maintain namespace', function () {
      expect(tu.maintain.workorder).to.be.an('object')
      expect(tu.maintain.inspection).to.be.an('object')
      expect(tu.maintain.service_request).to.be.an('object')
      expect(tu.maintain.asset).to.be.an('object')
      expect(tu.maintain.employee).to.be.an('object')
      expect(tu.maintain.cost).to.be.an('object')
    })
  })

  // ─── TrimbleUnity (Construct) class ────────────────────────────────────────

  describe('TrimbleUnity (Construct)', function () {
    it('has configure method', function () {
      expect(tu.TrimbleUnity.configure).to.be.a('function')
    })

    it('has authenticate method', function () {
      expect(tu.TrimbleUnity.authenticate).to.be.a('function')
    })

    it('has runRequest method', function () {
      expect(tu.TrimbleUnity.runRequest).to.be.a('function')
    })

    it('has getToken method', function () {
      expect(tu.TrimbleUnity.getToken).to.be.a('function')
    })

    it('has setToken method', function () {
      expect(tu.TrimbleUnity.setToken).to.be.a('function')
    })

    it('getToken returns undefined before authentication', function () {
      expect(tu.TrimbleUnity.getToken()).to.be.undefined
    })

    it('configure sets base url', function () {
      tu.TrimbleUnity.configure('api2.e-builder.net')
      expect(tu.TrimbleUnity.getBaseUrl()).to.equal('api2.e-builder.net')
    })

    it('setToken stores and retrieves a token', function () {
      tu.TrimbleUnity.setToken('test-token-123')
      expect(tu.TrimbleUnity.getToken()).to.equal('test-token-123')
      // Reset
      tu.TrimbleUnity.setToken('')
    })

    it('v() returns the configured version number', function () {
      tu.TrimbleUnity.configure('api2.e-builder.net', { version: 2 })
      expect(tu.TrimbleUnity.v()).to.equal(2)
    })

    it('configure returns true on success', function () {
      const result = tu.TrimbleUnity.configure('api2.e-builder.net')
      expect(result).to.equal(true)
    })
  })

  // ─── Construct service modules (method presence) ────────────────────────────

  describe('Construct: project module', function () {
    it('has getAll method', function () { expect(tu.project.getAll).to.be.a('function') })
    it('has getById method', function () { expect(tu.project.getById).to.be.a('function') })
    it('has query method', function () { expect(tu.project.query).to.be.a('function') })
    it('has getCustomFields method', function () { expect(tu.project.getCustomFields).to.be.a('function') })
    it('has getBudgetLineItems method', function () { expect(tu.project.getBudgetLineItems).to.be.a('function') })
    it('has getCommitments method', function () { expect(tu.project.getCommitments).to.be.a('function') })
  })

  describe('Construct: budget module', function () {
    it('has getAll method', function () { expect(tu.budget.getAll).to.be.a('function') })
    it('has getById method', function () { expect(tu.budget.getById).to.be.a('function') })
    it('has getLineItems method', function () { expect(tu.budget.getLineItems).to.be.a('function') })
    it('has getTransactions method', function () { expect(tu.budget.getTransactions).to.be.a('function') })
  })

  describe('Construct: commitment module', function () {
    it('has getAll method', function () { expect(tu.commitment.getAll).to.be.a('function') })
    it('has getById method', function () { expect(tu.commitment.getById).to.be.a('function') })
    it('has getInvoices method', function () { expect(tu.commitment.getInvoices).to.be.a('function') })
  })

  describe('Construct: invoice module', function () {
    it('has getAll method', function () { expect(tu.invoice.getAll).to.be.a('function') })
    it('has getById method', function () { expect(tu.invoice.getById).to.be.a('function') })
    it('has getAllGeneral method', function () { expect(tu.invoice.getAllGeneral).to.be.a('function') })
  })

  describe('Construct: company module', function () {
    it('has getAll method', function () { expect(tu.company.getAll).to.be.a('function') })
    it('has getContacts method', function () { expect(tu.company.getContacts).to.be.a('function') })
  })

  describe('Construct: contact module', function () {
    it('has getAll method', function () { expect(tu.contact.getAll).to.be.a('function') })
    it('has getById method', function () { expect(tu.contact.getById).to.be.a('function') })
  })

  describe('Construct: document module', function () {
    it('has getAll method', function () { expect(tu.document.getAll).to.be.a('function') })
    it('has getByProject method', function () { expect(tu.document.getByProject).to.be.a('function') })
  })

  describe('Construct: funding_source module', function () {
    it('has getAll method', function () { expect(tu.funding_source.getAll).to.be.a('function') })
    it('has getDistributions method', function () { expect(tu.funding_source.getDistributions).to.be.a('function') })
  })

  describe('Construct: process module', function () {
    it('has getAll method', function () { expect(tu.process.getAll).to.be.a('function') })
    it('has getByProject method', function () { expect(tu.process.getByProject).to.be.a('function') })
    it('has getSteps method', function () { expect(tu.process.getSteps).to.be.a('function') })
  })

  // ─── TrimbleUnityMaintain class ────────────────────────────────────────────

  describe('TrimbleUnityMaintain (Maintain)', function () {
    it('exports TrimbleUnityMaintain class', function () {
      expect(tu.maintain.TrimbleUnityMaintain).to.be.a('function')
    })

    it('can instantiate TrimbleUnityMaintain', function () {
      const instance = new tu.maintain.TrimbleUnityMaintain()
      expect(instance).to.be.an('object')
    })

    it('has configure method', function () {
      expect(tu.maintain.tu_maintain.configure).to.be.a('function')
    })

    it('has authenticate method', function () {
      expect(tu.maintain.tu_maintain.authenticate).to.be.a('function')
    })

    it('has runRequest method', function () {
      expect(tu.maintain.tu_maintain.runRequest).to.be.a('function')
    })

    it('has getToken method', function () {
      expect(tu.maintain.tu_maintain.getToken).to.be.a('function')
    })

    it('has setToken method', function () {
      expect(tu.maintain.tu_maintain.setToken).to.be.a('function')
    })

    it('defaults base_url to cityworksonline', function () {
      const instance = new tu.maintain.TrimbleUnityMaintain()
      expect(instance.getBaseUrl()).to.equal('cityworksonline')
    })

    it('configure sets the base url', function () {
      tu.maintain.tu_maintain.configure('maintain.example.com')
      expect(tu.maintain.tu_maintain.getBaseUrl()).to.equal('maintain.example.com')
    })

    it('setToken stores and retrieves a token', function () {
      tu.maintain.tu_maintain.setToken('maintain-token-abc')
      expect(tu.maintain.tu_maintain.getToken()).to.equal('maintain-token-abc')
      tu.maintain.tu_maintain.setToken('')
    })

    it('configure returns true on success', function () {
      const result = tu.maintain.tu_maintain.configure('cityworksonline')
      expect(result).to.equal(true)
    })
  })

  // ─── Maintain service modules (method presence) ────────────────────────────

  describe('Maintain: workorder module', function () {
    it('has getById method', function () { expect(tu.maintain.workorder.getById).to.be.a('function') })
    it('has search method', function () { expect(tu.maintain.workorder.search).to.be.a('function') })
    it('has getAll method', function () { expect(tu.maintain.workorder.getAll).to.be.a('function') })
    it('has create method', function () { expect(tu.maintain.workorder.create).to.be.a('function') })
    it('has update method', function () { expect(tu.maintain.workorder.update).to.be.a('function') })
    it('has close method', function () { expect(tu.maintain.workorder.close).to.be.a('function') })
    it('has cancel method', function () { expect(tu.maintain.workorder.cancel).to.be.a('function') })
    it('has delete method', function () { expect(tu.maintain.workorder.delete).to.be.a('function') })
    it('has getComments method', function () { expect(tu.maintain.workorder.getComments).to.be.a('function') })
    it('has addComment method', function () { expect(tu.maintain.workorder.addComment).to.be.a('function') })
    it('has getTasks method', function () { expect(tu.maintain.workorder.getTasks).to.be.a('function') })
    it('has getEntities method', function () { expect(tu.maintain.workorder.getEntities).to.be.a('function') })
    it('has getEntityTypes method', function () { expect(tu.maintain.workorder.getEntityTypes).to.be.a('function') })
  })

  describe('Maintain: inspection module', function () {
    it('has getById method', function () { expect(tu.maintain.inspection.getById).to.be.a('function') })
    it('has search method', function () { expect(tu.maintain.inspection.search).to.be.a('function') })
    it('has getAll method', function () { expect(tu.maintain.inspection.getAll).to.be.a('function') })
    it('has create method', function () { expect(tu.maintain.inspection.create).to.be.a('function') })
    it('has update method', function () { expect(tu.maintain.inspection.update).to.be.a('function') })
    it('has close method', function () { expect(tu.maintain.inspection.close).to.be.a('function') })
    it('has getResults method', function () { expect(tu.maintain.inspection.getResults).to.be.a('function') })
    it('has getComments method', function () { expect(tu.maintain.inspection.getComments).to.be.a('function') })
    it('has getEntityTypes method', function () { expect(tu.maintain.inspection.getEntityTypes).to.be.a('function') })
  })

  describe('Maintain: service_request module', function () {
    it('has getById method', function () { expect(tu.maintain.service_request.getById).to.be.a('function') })
    it('has search method', function () { expect(tu.maintain.service_request.search).to.be.a('function') })
    it('has create method', function () { expect(tu.maintain.service_request.create).to.be.a('function') })
    it('has update method', function () { expect(tu.maintain.service_request.update).to.be.a('function') })
    it('has close method', function () { expect(tu.maintain.service_request.close).to.be.a('function') })
    it('has getLinkedWorkOrders method', function () { expect(tu.maintain.service_request.getLinkedWorkOrders).to.be.a('function') })
    it('has linkWorkOrder method', function () { expect(tu.maintain.service_request.linkWorkOrder).to.be.a('function') })
    it('has getProblemCodes method', function () { expect(tu.maintain.service_request.getProblemCodes).to.be.a('function') })
  })

  describe('Maintain: asset module', function () {
    it('has search method', function () { expect(tu.maintain.asset.search).to.be.a('function') })
    it('has getWorkOrders method', function () { expect(tu.maintain.asset.getWorkOrders).to.be.a('function') })
    it('has getInspections method', function () { expect(tu.maintain.asset.getInspections).to.be.a('function') })
    it('has getServiceRequests method', function () { expect(tu.maintain.asset.getServiceRequests).to.be.a('function') })
    it('has getEntityTypes method', function () { expect(tu.maintain.asset.getEntityTypes).to.be.a('function') })
    it('has getEntityFields method', function () { expect(tu.maintain.asset.getEntityFields).to.be.a('function') })
    it('has getHistory method', function () { expect(tu.maintain.asset.getHistory).to.be.a('function') })
  })

  describe('Maintain: employee module', function () {
    it('has getById method', function () { expect(tu.maintain.employee.getById).to.be.a('function') })
    it('has current method', function () { expect(tu.maintain.employee.current).to.be.a('function') })
    it('has search method', function () { expect(tu.maintain.employee.search).to.be.a('function') })
    it('has getAll method', function () { expect(tu.maintain.employee.getAll).to.be.a('function') })
    it('has getGroups method', function () { expect(tu.maintain.employee.getGroups).to.be.a('function') })
    it('has getWorkOrders method', function () { expect(tu.maintain.employee.getWorkOrders).to.be.a('function') })
    it('has getInspections method', function () { expect(tu.maintain.employee.getInspections).to.be.a('function') })
  })

  describe('Maintain: cost module', function () {
    it('has getWorkOrderLabor method', function () { expect(tu.maintain.cost.getWorkOrderLabor).to.be.a('function') })
    it('has addWorkOrderLabor method', function () { expect(tu.maintain.cost.addWorkOrderLabor).to.be.a('function') })
    it('has getWorkOrderMaterial method', function () { expect(tu.maintain.cost.getWorkOrderMaterial).to.be.a('function') })
    it('has addWorkOrderMaterial method', function () { expect(tu.maintain.cost.addWorkOrderMaterial).to.be.a('function') })
    it('has getWorkOrderEquipment method', function () { expect(tu.maintain.cost.getWorkOrderEquipment).to.be.a('function') })
    it('has getInspectionLabor method', function () { expect(tu.maintain.cost.getInspectionLabor).to.be.a('function') })
    it('has addInspectionLabor method', function () { expect(tu.maintain.cost.addInspectionLabor).to.be.a('function') })
    it('has getServiceRequestLabor method', function () { expect(tu.maintain.cost.getServiceRequestLabor).to.be.a('function') })
  })

  // ─── Live Construct tests (skipped without env vars) ───────────────────────

  describe('TrimbleUnity Construct live API', function () {
    const host = process.env.TUHOST
    const login = process.env.TULOGIN
    const password = process.env.TUPASSWORD

    before(function () {
      if (!host || !login || !password) {
        this.skip()
      }
    })

    it('authenticates and receives a token', function () {
      tu.TrimbleUnity.configure(host)
      return tu.TrimbleUnity.authenticate(login, password).then((result) => {
        expect(result).to.equal(true)
        expect(tu.TrimbleUnity.getToken()).to.be.a('string').and.not.empty
      })
    })
  })

  // ─── Live Maintain tests (skipped without env vars) ────────────────────────

  describe('TrimbleUnityMaintain live API', function () {
    const host = process.env.MAINTAIN_HOST
    const login = process.env.MAINTAIN_LOGIN
    const password = process.env.MAINTAIN_PASSWORD

    before(function () {
      if (!host || !login || !password) {
        this.skip()
      }
    })

    it('authenticates and receives a token', function () {
      tu.maintain.tu_maintain.configure(host, { path: 'cityworks', version: 23 })
      return tu.maintain.tu_maintain.authenticate(login, password).then((result) => {
        expect(result).to.equal(true)
        expect(tu.maintain.tu_maintain.getToken()).to.be.a('string').and.not.empty
      })
    })
  })
})
