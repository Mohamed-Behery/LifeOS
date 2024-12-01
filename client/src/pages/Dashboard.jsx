import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Container = styled.div`
  p {
    font-size: 18px;
  }
`;

const Section = styled.div`
  margin-top: 32px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  @media screen and (max-width: 768px) {
    justify-content: center;
  }

  div {
    text-align: center;
    @media screen and (min-width: 768px) {
      flex: 1;
    }

    h4 {
      font-size: 18px;
      margin-bottom: 8px;
    }
  }
`;

const ChartContainer = styled.div`
  max-width: 200px;
  margin: 0 auto;
`;

const FilterContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  align-items: center;

  label {
    margin-right: 8px;
  }

  select,
  input {
    padding: 0 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }

  select:focus,
  input:focus {
    outline: none;
  }
`;

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [cashRegisters, setCashRegisters] = useState([]);
  const [banks, setBanks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [revenueTypes, setRevenueTypes] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [selectedCashRegister, setSelectedCashRegister] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedRevenueType, setSelectedRevenueType] = useState("");
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = axios.get("/api/tasks");
        const notesResponse = axios.get("/api/notes");
        const cashResponse = axios.get("/api/cash-registers");
        const bankResponse = axios.get("/api/banks");
        const revenueTypeResponse = axios.get("/api/revenue-types");
        const expenseTypeResponse = axios.get("/api/expense-types");

        const responses = await Promise.all([
          tasksResponse,
          notesResponse,
          cashResponse,
          bankResponse,
          revenueTypeResponse,
          expenseTypeResponse,
        ]);

        const tasksData = responses[0].data;
        const notesData = responses[1].data;
        const cashData = responses[2].data;
        const bankData = responses[3].data;
        const revenueTypeData = responses[4].data;
        const expenseTypeData = responses[5].data;

        setTasks(tasksData);
        setNotes(notesData);
        setCashRegisters(cashData);
        setBanks(bankData);
        setRevenueTypes(revenueTypeData);
        setExpenseTypes(expenseTypeData);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchExpenseAndRevenueData = async () => {
      try {
        const expenseResponse = axios.get(
          `/api/expenses?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        const revenueResponse = axios.get(
          `/api/revenues?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );

        const [expenseData, revenueData] = await Promise.all([
          expenseResponse,
          revenueResponse,
        ]);

        setExpenses(expenseData.data);
        setRevenues(revenueData.data);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      }
    };

    fetchExpenseAndRevenueData();
  }, [dateRange]);

  const totalExpenseAmount = selectedExpenseType
    ? Number(
        expenses
          .filter((exp) => exp.expense_type_id === selectedExpenseType)
          .reduce((sum, exp) => sum + exp.amount, 0)
      ).toFixed(2)
    : "0.00";

  const totalRevenueAmount = selectedRevenueType
    ? Number(
        revenues
          .filter((rev) => rev.revenue_type_id === selectedRevenueType)
          .reduce((sum, rev) => sum + rev.amount, 0)
      ).toFixed(2)
    : "0.00";

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  const tasksData = {
    labels: [
      `المهام المكتملة (${completionRate}%)`,
      `المهام المعلقة (${(100 - completionRate).toFixed(0)}%)`,
    ],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#0061ab", "#dc143d"],
      },
    ],
  };

  return (
    <Container>
      <h2>الإحصائيات</h2>
      <Section>
        <div>
          <h4>المهام</h4>
          <p>عدد المهام: {tasks.length}</p>
          <p>المهام المكتملة: {completedTasks}</p>
          <p>المهام المتبقية: {pendingTasks}</p>
          <p>نسبة الإنجاز: {completionRate}%</p>
        </div>
        <ChartContainer>
          <Pie data={tasksData} />
        </ChartContainer>
        <div>
          <h4>الملاحظات</h4>
          <p>عدد الملاحظات: {notes.length}</p>
        </div>
      </Section>
      <Section>
        <div>
          <h4>الكاش</h4>
          <FilterContainer>
            <label>اختر الخزينة:</label>
            <select
              onChange={(e) => setSelectedCashRegister(Number(e.target.value))}
              value={selectedCashRegister}
            >
              <option value="">اختر</option>
              {cashRegisters.map((cash) => (
                <option key={cash.id} value={cash.id}>
                  {cash.name}
                </option>
              ))}
            </select>
          </FilterContainer>

          <p>
            الرصيد الحالي: &nbsp;
            {selectedCashRegister
              ? cashRegisters.find((cash) => cash.id === selectedCashRegister)
                  ?.current_balance ?? 0
              : "اختر خزينة"}
          </p>
        </div>
        <div>
          <h4>البنوك</h4>
          <FilterContainer>
            <label>اختر البنك:</label>
            <select
              onChange={(e) => setSelectedBank(Number(e.target.value))}
              value={selectedBank}
            >
              <option value="">اختر</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </FilterContainer>
          <p>
            الرصيد الحالي: &nbsp;
            {selectedBank
              ? banks.find((bank) => bank.id === selectedBank)
                  ?.current_balance ?? 0
              : "اختر بنك"}
          </p>
        </div>
      </Section>

      <Section>
        <div>
          <h4>الإيرادات والمصروفات</h4>
          <FilterContainer>
            <label>الفترة:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </FilterContainer>
          <ChartContainer>
            <Bar
              data={{
                labels: ["المصروفات", "الدخل"],
                datasets: [
                  {
                    label: ["الإحصائيات"],
                    data: [
                      expenses.reduce((sum, exp) => sum + exp.amount, 0),
                      revenues.reduce((sum, rev) => sum + rev.amount, 0),
                    ],
                    backgroundColor: ["#f44336", "#4caf50"],
                  },
                ],
              }}
            />
          </ChartContainer>
        </div>
      </Section>

      <Section>
        <div>
          <h4>مصادر الدخل</h4>
          <FilterContainer>
            <label>نوع الدخل:</label>
            <select
              onChange={(e) => setSelectedRevenueType(Number(e.target.value))}
              value={selectedRevenueType}
            >
              <option value="">اختر</option>
              {revenueTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </FilterContainer>
          <p>
            المبلغ: &nbsp;
            {selectedRevenueType
              ? `${totalRevenueAmount} جنيه`
              : "اختر نوع الإيراد"}
          </p>
        </div>

        <div>
          <h4>أنواع المصروفات</h4>
          <FilterContainer>
            <label>نوع المصروف:</label>
            <select
              onChange={(e) => setSelectedExpenseType(Number(e.target.value))}
              value={selectedExpenseType}
            >
              <option value="">اختر</option>
              {expenseTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </FilterContainer>
          <p>
            المبلغ: &nbsp;
            {selectedExpenseType
              ? `${totalExpenseAmount} جنيه`
              : "اختر نوع المصروف"}
          </p>
        </div>
      </Section>
    </Container>
  );
}

export default Dashboard;
