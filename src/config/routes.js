/* eslint-disable react/jsx-key */
import React from 'react'
import makeLoadable from 'rmw-shell/lib/containers/MyLoadable'
import RestrictedRoute from 'rmw-shell/lib/containers/RestrictedRoute'
import LandingPage from '../pages/LandingPage/LandingPage'

const MyLoadable = (opts, preloadComponents) =>
  makeLoadable({ ...opts, firebase: () => import('./firebase') }, preloadComponents)

const AsyncDashboard = MyLoadable({ loader: () => import('../pages/Dashboard') })
const AsyncAbout = MyLoadable({ loader: () => import('../pages/About') })
const AsyncCompany = MyLoadable({ loader: () => import('../pages/Companies/Company') })
const AsyncCompanies = MyLoadable({ loader: () => import('../pages/Companies/Companies') }, [AsyncCompany])
const AsyncTask = MyLoadable({ loader: () => import('../pages/Tasks/Task') })
const AsyncDeals = MyLoadable({ loader: () => import('../pages/Deals/Deals') })
const AsyncDeal = MyLoadable({ loader: () => import('../pages/Deals/Deal') })
const AsyncTasks = MyLoadable({ loader: () => import('../pages/Tasks/Tasks') }, [AsyncTask])
const AsyncDocument = MyLoadable({ loader: () => import('../pages/Document') })
const AsyncCollection = MyLoadable({ loader: () => import('../pages/Collection') })

const routes = [
  <RestrictedRoute type="public" path="/" exact component={LandingPage} />,
  <RestrictedRoute type="private" path="/dashboard" exact component={AsyncDashboard} />,
  <RestrictedRoute type="private" path="/about" exact component={AsyncAbout} />,
  <RestrictedRoute type="private" path="/companies" exact component={AsyncCompanies} />,
  <RestrictedRoute type="private" path="/companies/edit/:uid" exact component={AsyncCompany} />,
  <RestrictedRoute type="private" path="/companies/create" exact component={AsyncCompany} />,
  <RestrictedRoute type="private" path="/tasks" exact component={AsyncTasks} />,
  <RestrictedRoute type="private" path="/deals" exact component={AsyncDeals} />,
  <RestrictedRoute type="private" path="/deals/:id" exact component={AsyncDeal} />,
  <RestrictedRoute type="private" path="/tasks/edit/:uid" exact component={AsyncTask} />,
  <RestrictedRoute type="private" path="/document" exact component={AsyncDocument} />,
  <RestrictedRoute type="private" path="/collection" exact component={AsyncCollection} />
]

export default routes
