import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import fetchDecorator from '../../utils/fetchFromApi';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [pageHits, setPageHits] = useState<any>([]);
  const [pageHitsByDay, setPageHitsByDay] = useState<any>([]);
  const [uniqueUsersByDay, setUniqueUsersByDay] = useState<any>([]);

  const bars = {
    series: [{
      name: 'Users and Page hits',
      data: [users.length, pageHits.length]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 150
      },
      colors: ['#5f9ea0'],
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Users', 'Page Hits'],
      },
      title: {
        text: 'Users and Page Hits'
      }
    }
  }
  const plot = {
    series: [
      {
        name: 'Page Hits by Day',
        data: pageHitsByDay.map((day: any) => [day._id, day.count])
      },
      {
        name: 'Unique Users By Day',
        data: uniqueUsersByDay.map((day: any) => [day._id, day.count])
      }
    ],
    options: {
      chart: {
        type: 'line',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
      },
      stroke: {
        curve: 'smooth'
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 5,
      },
      title: {
        text: 'Data by Day',
        align: 'left'
      },
      yaxis: {
        title: {
          text: 'Hits'
        },
      },
      xaxis: {
        type: 'datetime',
        title: { text: 'Date' }
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val: any) {
            return val
          }
        }
      }
    },
  };

  useEffect(() => {
    const req = new Request(`${process.env.REACT_APP_API}/users`);
    fetchDecorator(req)
      // .then(res => res.json())
      .then(res => setUsers(res))
      .catch(err => console.warn('error fetching users: ', err));

    fetch(`${process.env.REACT_APP_API}/pageHits`)
      .then(res => {console.log('users res: ', res); res.json()})
      .then(res => setPageHits(res))
      .catch(err => console.warn('error fetching pageHits: ', err));

    fetch(`${process.env.REACT_APP_API}/pageHitsByDay`)
      .then(res => res.json())
      .then(res => setPageHitsByDay(res))
      .catch(err => console.warn('error fetching pageHitsByDay: ', err));

    fetch(`${process.env.REACT_APP_API}/uniqueUsersByDay`)
      .then(res => res.json())
      .then(res => setUniqueUsersByDay(res))
      .catch(err => console.warn('error fetching uniqueUsersByDay: ', err));
  }, []);
  
  console.log('users: ', users);

  return (
    <div>
      <header>
        <h2>My Stats</h2>
      </header>
      <main>

        <ReactApexChart options={bars.options} series={bars.series} type="bar" height={150} />
        <ReactApexChart options={plot.options} series={plot.series} type="line" height={350} />

        <div>
          {users.map((user: any) => (
            <div>
              <h3>
                <span>User ID: {user._id}</span>
                <span>User Created At: {new Date(user.createdAt).toLocaleString()}</span>
              </h3>
              <table key={user._id}>
                <thead>
                  <tr>
                    <th>Created At</th>
                    <th>Country</th>
                    <th>City</th>
                    <th>Referrer</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {pageHits.filter((page: any) => page.userId === user._id).map((p: any) => (
                    <tr key={p._id}>
                      <td>{new Date(p.createdAt).toLocaleString()}</td>
                      <td>{p.country}</td>
                      <td>{p.city}</td>
                      <td>{p.referrer || 'None'}</td>
                      <td>{p.IP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
