'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import EmployeesPanel from '@/components/EmployeesPanel';
import PairsPanel from '@/components/PairsPanel';
import ScheduleTable from '@/components/ScheduleTable';
import ScheduleGrid from '@/components/ScheduleGrid';
import PersonalSchedule from '@/components/PersonalSchedule';
import { useSchedule } from '@/hooks/useSchedule';

export default function Home() {
  const {
    scheduleData,
    employees,
    pairs,
    currentMonth,
    isEditMode,
    activeTab,
    selectedEmployee,
    scheduleView,
    setIsEditMode,
    setActiveTab,
    setSelectedEmployee,
    setScheduleView,
    changeMonth,
    addEmployee,
    addPair,
    assignEmployeeToDays,
    assignPairToDays
  } = useSchedule();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          isEditMode={isEditMode}
          activeTab={activeTab}
          currentMonth={currentMonth}
          scheduleView={scheduleView}
          onEditModeToggle={() => setIsEditMode(!isEditMode)}
          onTabChange={setActiveTab}
          onMonthChange={changeMonth}
          onScheduleViewChange={setScheduleView}
        />

        <EmployeesPanel
          employees={employees}
          selectedEmployee={selectedEmployee}
          activeTab={activeTab}
          onAddEmployee={addEmployee}
          onSelectEmployee={setSelectedEmployee}
        />

        <PairsPanel
          pairs={pairs}
          employees={employees}
          onAddPair={addPair}
        />

        {activeTab === 'schedule' ? (
          scheduleView === 'table' ? (
            <ScheduleTable
              scheduleData={scheduleData}
              employees={employees}
              pairs={pairs}
              currentMonth={currentMonth}
              isEditMode={isEditMode}
              onAssignEmployee={assignEmployeeToDays}
              onAssignPair={assignPairToDays}
            />
          ) : (
            <ScheduleGrid
              scheduleData={scheduleData}
              employees={employees}
              pairs={pairs}
              currentMonth={currentMonth}
              isEditMode={isEditMode}
              onAssignEmployee={assignEmployeeToDays}
              onAssignPair={assignPairToDays}
            />
          )
        ) : (
          <PersonalSchedule
            scheduleData={scheduleData}
            selectedEmployee={selectedEmployee}
            currentMonth={currentMonth}
            employees={employees}
          />
        )}
      </div>
    </div>
  );
}