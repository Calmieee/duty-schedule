import { Calendar, Edit2, X, User, List, Grid } from 'lucide-react';

interface HeaderProps {
	isEditMode: boolean;
	activeTab: string;
	currentMonth: Date;
	scheduleView: string;
	onEditModeToggle: () => void;
	onTabChange: (tab: string) => void;
	onMonthChange: (delta: number) => void;
	onScheduleViewChange: (view: string) => void;
}

export default function Header({
	                               isEditMode,
	                               activeTab,
	                               currentMonth,
	                               scheduleView,
	                               onEditModeToggle,
	                               onTabChange,
	                               onMonthChange,
	                               onScheduleViewChange
                               }: HeaderProps) {
	const getMonthName = (date: Date) => {
		const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
			'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
		return months[date.getMonth()];
	};

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<Calendar className="w-10 h-10 text-blue-400" />
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
						Расписание дежурств
					</h1>
				</div>
				<button
					onClick={onEditModeToggle}
					className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
						isEditMode
							? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
							: 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50'
					}`}
				>
					{isEditMode ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
					{isEditMode ? 'Завершить' : 'Редактировать'}
				</button>
			</div>

			<div className="flex gap-2 mb-6">
				<button
					onClick={() => onTabChange('schedule')}
					className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
						activeTab === 'schedule'
							? 'bg-blue-500 shadow-lg shadow-blue-500/50'
							: 'bg-slate-700 hover:bg-slate-600'
					}`}
				>
					<Calendar className="w-5 h-5" />
					Общее расписание
				</button>
				<button
					onClick={() => onTabChange('personal')}
					className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
						activeTab === 'personal'
							? 'bg-purple-500 shadow-lg shadow-purple-500/50'
							: 'bg-slate-700 hover:bg-slate-600'
					}`}
				>
					<User className="w-5 h-5" />
					Личное расписание
				</button>

				{activeTab === 'schedule' && (
					<button
						onClick={() => onScheduleViewChange(scheduleView === 'table' ? 'grid' : 'table')}
						className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 transition-all ml-auto"
					>
						{scheduleView === 'table' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
						{scheduleView === 'table' ? 'Сетка' : 'Список'}
					</button>
				)}
			</div>

			<div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-6">
				<button
					onClick={() => onMonthChange(-1)}
					className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
				>
					← Предыдущий
				</button>
				<h2 className="text-2xl font-semibold">
					{getMonthName(currentMonth)} {currentMonth.getFullYear()}
				</h2>
				<button
					onClick={() => onMonthChange(1)}
					className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
				>
					Следующий →
				</button>
			</div>
		</>
	);
}