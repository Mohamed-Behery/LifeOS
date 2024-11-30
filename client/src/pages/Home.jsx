import styled from "styled-components";
import Card from "../components/Card";
import { faNoteSticky, faTasks } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Container = styled.div`
  p {
    font-size: 18px;
  }
`;

const Cards = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px 0;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const SectionsContainer = styled.div`
  margin-top: 32px;
`;

const Dashboard = styled.div`
  margin-top: 32px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }

  div {
    text-align: center;
    @media screen and (min-width: 768px) {
      flex: 1;
    }

    h4 {
      font-size: 24px;
      margin-bottom: 8px;
    }

    p {
      font-size: 18px;
      color: ${({ theme }) => theme.text};
    }
  }
`;

const ChartContainer = styled.div`
  max-width: 200px;
  margin: 0 auto;
`;

function Home() {
  const user = "محمد";

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
  });

  const sections = [
    { title: "الملاحظات", link: "/notes", icon: faNoteSticky },
    { title: "المهام", link: "/tasks", icon: faTasks },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await fetch("/api/tasks");
        const notesResponse = await fetch("/api/notes");

        const tasks = await tasksResponse.json();
        const notes = await notesResponse.json();

        const completedTasks = tasks.filter((task) => task.completed).length;

        setStats({
          totalTasks: tasks.length,
          completedTasks: completedTasks,
          totalNotes: notes.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const completionRate =
    stats.totalTasks > 0
      ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(0)
      : 0;

  const chartData = {
    labels: ["المهام المكتملة", "المهام غير المكتملة"],
    datasets: [
      {
        label: "نسبة الإنجاز",
        data: [stats.completedTasks, stats.totalTasks - stats.completedTasks],
        backgroundColor: ["#0061ab", "#dc143d"],
        hoverBackgroundColor: ["#1f5c8b", "#b31f3d"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(0);

            return `${label}: ${percentage}% (${value})`;
          },
        },
      },
      legend: {
        position: "bottom",
      },
      datalabels: {
        display: true,
        color: "white",
        font: {
          size: 16,
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <Container>
      <div>
        <h2>{user} ، أهلاً بيك في LifeOS</h2>
        <p>نظام إدارة حياتك.</p>
      </div>
      <Dashboard>
        <div>
          <h4>المهام</h4>
          <p>عدد المهام: {stats.totalTasks}</p>
          <p>المهام المكتملة: {stats.completedTasks}</p>
          <p>نسبة الإنجاز: {completionRate}%</p>
        </div>
        <ChartContainer>
          <Pie data={chartData} options={chartOptions} />
        </ChartContainer>

        <div>
          <h4>الملاحظات</h4>
          <p>عدد الملاحظات: {stats.totalNotes}</p>
        </div>
      </Dashboard>
      <SectionsContainer>
        <h3>الأقسام:</h3>
        <Cards>
          {sections.map((section, index) => (
            <Card
              key={index}
              title={section.title}
              link={section.link}
              icon={section.icon}
            />
          ))}
        </Cards>
      </SectionsContainer>
    </Container>
  );
}

export default Home;
