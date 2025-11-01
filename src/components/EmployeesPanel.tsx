import { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Employee } from '@/types';

interface EmployeesPanelProps {
	employees: Employee[];
	selectedEmployee: string | null;
	activeTab: string;
	onAddEmployee: (name: string) => void;
	onSelectEmployee: (name: string) => void;
}

export default function EmployeesPanel({
	                                       employees,
	                                       selectedEmployee,
	                                       activeTab,
	                                       onAddEmployee,
	                                       onSelectEmployee
                                       }: EmployeesPanelProps) {
	const [showModal, setShowModal] = useState(false);
	const [newEmployee, setNewEmployee] = useState('');

	const handleAdd = () => {
		if (newEmployee.trim()) {
			onAddEmployee(newEmployee.trim());
			setNewEmployee('');
			setShowModal(false);
		}
	};

	return (
		<>
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<Users className="w-6 h-6 text-blue-400" />
						<h3 className="text-xl font-semibold">Сотрудники</h3>
					</div>
					<button
						onClick={() => setShowModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
					>
						<Plus className="w-4 h-4" />
						Добавить
					</button>
				</div>
				<div className="flex flex-wrap gap-3">
					{employees.map(emp => (
						<div
							key={emp.id}
							className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-all hover:scale-105 ${
								activeTab === 'personal' && selectedEmployee === emp.name ? 'ring-2 ring-white' : ''
							}`}
							style={{ backgroundColor: emp.color }}
							onClick={() => activeTab === 'personal' && onSelectEmployee(emp.name)}
						>
							{emp.name}
						</div>
					))}
				</div>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-96">
						<h3 className="text-xl font-semibold mb-4">Добавить сотрудника</h3>
						<input
							type="text"
							value={newEmployee}
							onChange={(e) => setNewEmployee(e.target.value)}
							placeholder="Имя сотрудника"
							className="w-full px-4 py-2 bg-slate-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
							onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
						/>
						<div className="flex gap-3">
							<button
								onClick={handleAdd}
								className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
							>
								Добавить
							</button>
							<button
								onClick={() => {
									setShowModal(false);
									setNewEmployee('');
								}}
								className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
							>
								Отмена
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}