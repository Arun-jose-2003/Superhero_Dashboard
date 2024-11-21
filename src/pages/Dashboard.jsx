import React, { useEffect, useState } from 'react';
import { BarChartIcon, FileText, LogOut, PieChartIcon, Users } from 'lucide-react';
import { Card, Col, Container, Row, ListGroup, Button } from 'react-bootstrap';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { viewAllGrievanceAPI } from '../Services/allAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Sidebar = styled(Col)`
  background: linear-gradient(to bottom, #4b6cb7, #182848);
  padding: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled(Col)`
  padding: 30px;
`;

const StyledCard = styled(Card)`
  background: white;
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled(Card.Title)`
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
`;

const CardValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #4b6cb7;
`;

const StyledListGroup = styled(ListGroup)`
  background: transparent;
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  background: transparent;
  color: #fff;
  border: none;
  padding: 15px;
  transition: all 0.3s ease;
  border-radius: 10px;
  margin-bottom: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  &:active {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LogoutButton = styled(Button)`
  background: #ff4757;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b81;
    transform: scale(1.05);
  }
`;

const ChartCard = styled(StyledCard)`
  height: 400px;
`;

const DashboardTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

export default function Dashboard() {
  const [grievance, setGrievance] = useState([]);
  const [totalGrievance, setTotalGrievance] = useState(0);
  const [resolvedGrievance, setResolvedGrievance] = useState(0);
  const [pendingGrievance, setPendingGrievance] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [highUrgencyGrievance, setHighUrgencyGrievance] = useState(0);

  console.log(grievance);
  console.log(totalGrievance);
  console.log(resolvedGrievance);
  console.log(pendingGrievance);
  console.log(categoryData);
  console.log(highUrgencyGrievance);
  

  const navigate = useNavigate()

  const viewAllGrievance = async () => {
    try {
      const result = await viewAllGrievanceAPI();
      if (result.status === 200) {
        const grievanceData = result.data;
        setGrievance(grievanceData);

        const total = grievanceData.length;
        const resolved = grievanceData.filter(item => item.status === 'Resolved').length;
        const pending = grievanceData.filter(item => item.status === 'Pending').length;

        setTotalGrievance(total);
        setResolvedGrievance(resolved);
        setPendingGrievance(pending);

        const categories = grievanceData.reduce((acc, item) => {
          const category = item.category || 'Other';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const formattedCategoryData = Object.keys(categories).map(category => ({
          name: category,
          value: categories[category],
        }));

        setCategoryData(formattedCategoryData);

        // Set high urgency grievances count
        const highUrgencyCount = grievanceData.filter(item => item.urgency === 'High').length;
        setHighUrgencyGrievance(highUrgencyCount);
      } else {
        console.log('Error fetching data', result.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    // Clear session storage or token
    sessionStorage.removeItem("username"); // Update the state to false after logout
    toast.info("Admin logged out");
    navigate('/')  // Redirect to the login page
  };

  useEffect(() => {
    viewAllGrievance();
  }, []);

  return (
    <DashboardContainer fluid className="d-flex">
      <Row className="w-100">
        <Sidebar md={3} className="d-flex flex-column">
          <h2 className="text-center mb-4 text-white">Admin Dashboard</h2>
          <StyledListGroup className="flex-grow-1">
            <StyledListGroupItem action href="#" className="d-flex align-items-center">
              <BarChartIcon className="mr-2" />
              Dashboard
            </StyledListGroupItem>
            <StyledListGroupItem action href='/grievance' className="d-flex align-items-center">
              <FileText className="mr-2" />
              Grievance
            </StyledListGroupItem>
            
          </StyledListGroup>
          <LogoutButton onClick={handleLogout} className="d-flex align-items-center justify-content-center mt-auto">
            <LogOut className="mr-2" />
            Logout
          </LogoutButton>
        </Sidebar>

        <MainContent md={9}>
          <DashboardTitle>Dashboard Overview</DashboardTitle>
          <Row className="g-4 mb-5">
            <Col sm={12} md={3}>
              <StyledCard>
                <Card.Body>
                  <CardTitle>Total Grievance</CardTitle>
                  <CardValue>{totalGrievance}</CardValue>
                </Card.Body>
              </StyledCard>
            </Col>
            <Col sm={12} md={3}>
              <StyledCard>
                <Card.Body>
                  <CardTitle>Resolved Grievance</CardTitle>
                  <CardValue>{resolvedGrievance}</CardValue>
                </Card.Body>
              </StyledCard>
            </Col>
            <Col sm={12} md={3}>
              <StyledCard>
                <Card.Body>
                  <CardTitle>Pending Grievance</CardTitle>
                  <CardValue>{pendingGrievance}</CardValue>
                </Card.Body>
              </StyledCard>
            </Col>
            {highUrgencyGrievance > 0 && (
              <Col sm={12} md={3}>
                <StyledCard className="bg-danger text-white">
                  <Card.Body>
                    <CardTitle>High Urgency Grievance</CardTitle>
                    <CardValue>{highUrgencyGrievance}</CardValue>
                  </Card.Body>
                </StyledCard>
              </Col>
            )}
          </Row>

          <Row className="g-4">
            <Col sm={12}>
              <ChartCard>
                <Card.Header className="bg-transparent border-0">
                  <h3>Grievance Status Distribution</h3>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 d-flex justify-content-center">
                    {categoryData.map((entry, index) => (
                      <div key={`legend-${index}`} className="mx-2 d-flex align-items-center">
                        <div className="mr-2" style={{ width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </ChartCard>
            </Col>
          </Row>
        </MainContent>
      </Row>
    </DashboardContainer>
  );
}