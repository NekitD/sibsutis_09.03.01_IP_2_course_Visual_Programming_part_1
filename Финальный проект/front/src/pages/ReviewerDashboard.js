import React, { useState } from 'react'
import {
  NewRequestsTab,
  InProgressReviewsTab,
  CompletedReviewsTab,
} from './ReviewerPage'
import '../styles/reviewer.css'

const TABS = [
  { key: 'new', label: 'Новые запросы', Component: NewRequestsTab },
  { key: 'inprogress', label: 'В процессе', Component: InProgressReviewsTab },
  { key: 'completed', label: 'Завершённые', Component: CompletedReviewsTab },
]

export default function ReviewerDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const ActiveComponent = TABS.find(t => t.key === activeTab)?.Component

  return (
    <div className="container">
      <h2>Панель рецензента</h2>
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}