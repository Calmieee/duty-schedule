import { useState, useEffect } from 'react';
import { DaySchedule, Employee, Pair } from '@/types';

export function useSchedule() {
	const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [pairs, setPairs] = useState<Pair[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [isEditMode, setIsEditMode] = useState(false);
	const [activeTab, setActiveTab] = useState('schedule');
	const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
	const [scheduleView, setScheduleView] = useState('grid');

	useEffect(() => {
		loadEmployees();
		loadPairs();
	}, []);

	useEffect(() => {
		initializeSchedule();
	}, [currentMonth, employees, pairs]);

	const loadEmployees = () => {
		const defaultEmployees: Employee[] = [
			{ id: '1', name: 'Фризен', color: '#ef4444' },
			{ id: '2', name: 'Кузнецов', color: '#dc2626' },
			{ id: '3', name: 'Арама', color: '#a855f7' },
			{ id: '4', name: 'Вагабов', color: '#84cc16' },
			{ id: '5', name: 'Ковалёва', color: '#22c55e' },
			{ id: '6', name: 'Зеленко', color: '#06b6d4' },
			{ id: '7', name: 'Дюков', color: '#eab308' },
			{ id: '8', name: 'Сафиуллин', color: '#ec4899' },
			{ id: '9', name: 'Орлов', color: '#f97316' }
		];
		setEmployees(defaultEmployees);
		setSelectedEmployee(defaultEmployees[0].name);
	};

	const loadPairs = () => {
		const defaultPairs: Pair[] = [
			{ id: '1', senior: 'Фризен', junior: 'Кузнецов', color: '#ef4444' },
			{ id: '2', senior: 'Арама', junior: 'Вагабов', color: '#a855f7' },
			{ id: '3', senior: 'Ковалёва', junior: 'Зеленко', color: '#22c55e' },
			{ id: '4', senior: 'Дюков', junior: 'Сафиуллин', color: '#eab308' }
		];
		setPairs(defaultPairs);
	};

	const initializeSchedule = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const schedule: DaySchedule[] = [];
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			const dayOfWeek = date.getDay();

			const daySchedule: DaySchedule = {
				date: day,
				dayOfWeek: getDayName(dayOfWeek),
				isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
				shifts: {
					'День': { 'Дежурный': '', 'Млад. Дежурный': '' },
					'Ночь': { 'Дежурный': '', 'Млад. Дежурный': '' }
				}
			};

			// Случайное заполнение парами
			if (pairs.length > 0 && Math.random() > 0.1) {
				const dayPair = pairs[Math.floor(Math.random() * pairs.length)];
				daySchedule.shifts['День']['Дежурный'] = dayPair.senior;
				daySchedule.shifts['День']['Млад. Дежурный'] = dayPair.junior;

				const nightPair = pairs[Math.floor(Math.random() * pairs.length)];
				daySchedule.shifts['Ночь']['Дежурный'] = nightPair.senior;
				daySchedule.shifts['Ночь']['Млад. Дежурный'] = nightPair.junior;
			}

			schedule.push(daySchedule);
		}

		setScheduleData(schedule);
	};

	const getDayName = (day: number) => {
		const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
		return days[day];
	};

	const changeMonth = (delta: number) => {
		const newDate = new Date(currentMonth);
		newDate.setMonth(newDate.getMonth() + delta);
		setCurrentMonth(newDate);
	};

	const addEmployee = (name: string) => {
		const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
		const newEmp: Employee = {
			id: String(employees.length + 1),
			name: name,
			color: colors[Math.floor(Math.random() * colors.length)]
		};
		setEmployees([...employees, newEmp]);
	};

	const addPair = (senior: string, junior: string) => {
		const seniorEmp = employees.find(e => e.name === senior);
		const newPair: Pair = {
			id: String(pairs.length + 1),
			senior,
			junior,
			color: seniorEmp?.color || '#6b7280'
		};
		setPairs([...pairs, newPair]);
	};

	const assignEmployeeToDays = (days: number[], shift: string, role: string, name: string) => {
		const newSchedule = [...scheduleData];
		days.forEach(day => {
			const dayIndex = newSchedule.findIndex(d => d.date === day);
			if (dayIndex !== -1) {
				newSchedule[dayIndex].shifts[shift][role] = name;
			}
		});
		setScheduleData(newSchedule);
	};

	const assignPairToDays = (days: number[], shift: string, pairId: string) => {
		const pair = pairs.find(p => p.id === pairId);
		if (!pair) return;

		const newSchedule = [...scheduleData];
		days.forEach(day => {
			const dayIndex = newSchedule.findIndex(d => d.date === day);
			if (dayIndex !== -1) {
				newSchedule[dayIndex].shifts[shift]['Дежурный'] = pair.senior;
				newSchedule[dayIndex].shifts[shift]['Млад. Дежурный'] = pair.junior;
			}
		});
		setScheduleData(newSchedule);
	};

	return {
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
	};
}
