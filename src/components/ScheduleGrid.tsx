import { useState } from 'react';
import { DaySchedule, Employee, Pair } from '@/types';

interface ScheduleGridProps {
	scheduleData: DaySchedule[];
	employees: Employee[];
	pairs: Pair[];
	currentMonth: Date;
	isEditMode: boolean;
	onAssignEmployee: (days: number[], shift: string, role: string, name: string) => void;
	onAssignPair: (days: number[], shift: string, pairId: string) => void;
}

export default function ScheduleGrid({
	                                     scheduleData,
	                                     employees,
	                                     pairs,
	                                     currentMonth,
	                                     isEditMode,
	                                     onAssignEmployee,
	                                     onAssignPair
                                     }: ScheduleGridProps) {
	const [selectedDays, setSelectedDays] = useState<number[]>([]);
	const [selectedShift, setSelectedShift] = useState<string>('День');
	const [showAssignModal, setShowAssignModal] = useState(false);

	const getDayName = (dayOfWeek: string) => {
		const map: Record<string, string> = {
			'Понедельник': 'Пн', 'Вторник': 'Вт', 'Среда': 'Ср',
			'Четверг': 'Чт', 'Пятница': 'Пт', 'Суббота': 'Сб', 'Воскресенье': 'Вс'
		};
		return map[dayOfWeek] || dayOfWeek;
	};

	const getEmployeeColor = (name: string) => {
		const employee = employees.find(e => e.name === name);
		return employee?.color || '#6b7280';
	};

	const handleDayClick = (day: number) => {
		if (!isEditMode) return;

		setSelectedDays(prev =>
			prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
		);
	};

	const handleAssignPair = (pairId: string) => {
		if (selectedDays.length > 0) {
			onAssignPair(selectedDays, selectedShift, pairId);
			setSelectedDays([]);
			setShowAssignModal(false);
		}
	};

	return (
		<>
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
				{isEditMode && (
					<div className="mb-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
						<div className="flex items-center justify-between mb-3">
							<div>
								<div className="font-semibold">Режим выбора дней</div>
								<div className="text-sm text-slate-300">
									Выбрано дней: {selectedDays.length}
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => setSelectedShift('День')}
									className={`px-4 py-2 rounded-lg transition-colors ${
										selectedShift === 'День' ? 'bg-yellow-500' : 'bg-slate-700'
									}`}
								>
									День
								</button>
								<button
									onClick={() => setSelectedShift('Ночь')}
									className={`px-4 py-2 rounded-lg transition-colors ${
										selectedShift === 'Ночь' ? 'bg-indigo-500' : 'bg-slate-700'
									}`}
								>
									Ночь
								</button>
							</div>
						</div>
						{selectedDays.length > 0 && (
							<button
								onClick={() => setShowAssignModal(true)}
								className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
							>
								Назначить пару на выбранные дни
							</button>
						)}
					</div>
				)}

				<div className="grid grid-cols-7 gap-2">
					{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
						<div key={day} className="text-center font-semibold text-slate-400 p-2">
							{day}
						</div>
					))}

					{(() => {
						const year = currentMonth.getFullYear();
						const month = currentMonth.getMonth();
						const firstDay = new Date(year, month, 1).getDay();
						const startOffset = firstDay === 0 ? 6 : firstDay - 1;
						const cells = [];

						for (let i = 0; i < startOffset; i++) {
							cells.push(<div key={`empty-${i}`} className="p-2"></div>);
						}

						scheduleData.forEach((day, index) => {
							const isSelected = selectedDays.includes(day.date);
							const isWeekend = day.isWeekend;

							cells.push(
								<div
									key={day.date}
									onClick={() => handleDayClick(day.date)}
									className={`p-3 rounded-lg border-2 transition-all ${
										isEditMode ? 'cursor-pointer hover:scale-105' : ''
									} ${
										isSelected ? 'border-blue-400 bg-blue-900/50' :
											isWeekend ? 'border-red-500/30 bg-red-900/20' :
												'border-slate-600 bg-slate-800/50'
									}`}
								>
									<div className={`text-center font-bold mb-2 ${isWeekend ? 'text-red-400' : ''}`}>
										{day.date}
									</div>
									<div className="space-y-1">
										{/* День */}
										{day.shifts['День']['Дежурный'] && (
											<div className="text-xs p-2 rounded" style={{ backgroundColor: getEmployeeColor(day.shifts['День']['Дежурный']) }}>
												<div className="font-semibold">☀️ День</div>
												<div className="mt-1">{day.shifts['День']['Дежурный']}</div>
												<div className="opacity-75">{day.shifts['День']['Млад. Дежурный']}</div>
											</div>
										)}
										{/* Ночь */}
										{day.shifts['Ночь']['Дежурный'] && (
											<div className="text-xs p-2 rounded" style={{ backgroundColor: getEmployeeColor(day.shifts['Ночь']['Дежурный']) }}>
												<div className="font-semibold">🌙 Ночь</div>
												<div className="mt-1">{day.shifts['Ночь']['Дежурный']}</div>
												<div className="opacity-75">{day.shifts['Ночь']['Млад. Дежурный']}</div>
											</div>
										)}
									</div>
								</div>
							);
						});

						return cells;
					})()}
				</div>
			</div>

			{showAssignModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-96 max-h-[80vh] overflow-y-auto">
						<h3 className="text-xl font-semibold mb-4">
							Выбрать пару для {selectedShift === 'День' ? 'дневной' : 'ночной'} смены
						</h3>
						<div className="text-sm text-slate-300 mb-4">
							Дни: {selectedDays.sort((a, b) => a - b).join(', ')}
						</div>
						<div className="space-y-2">
							{pairs.map(pair => (
								<button
									key={pair.id}
									onClick={() => handleAssignPair(pair.id)}
									className="w-full p-4 rounded-lg border-2 text-left transition-all hover:scale-105"
									style={{ borderColor: pair.color, backgroundColor: pair.color + '20' }}
								>
									<div className="font-bold">{pair.senior}</div>
									<div className="text-sm opacity-75">{pair.junior}</div>
								</button>
							))}
						</div>
						<button
							onClick={() => {
								setShowAssignModal(false);
								setSelectedDays([]);
							}}
							className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
						>
							Отмена
						</button>
					</div>
				</div>
			)}
		</>
	);
}