import React from 'react';
import ReactApexChart from 'react-apexcharts';
import DataStateProvider, { useDataContext } from '../../context/dataContext';
import Auth from '../../utils/oktaAuth';

const Dashboard: React.FC = () => {

  const {
    loading,
    error,
    usersCount,
    pageHitsCount,
    pageHitsByDay,
    uniqueUsersByDay,
    pageHitsByUser
  } = useDataContext().state;

  const bars = {
    series: [{
      name: 'Users and Page hits',
      data: [usersCount, pageHitsCount]
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

  console.log('pageHitsByDay: ', pageHitsByDay)
  return (
    <div>
      <header>
        <h2>My Stats</h2>
        <button onClick={() => Auth.logout()}>Log Out</button>
      </header>
      {error ? (
        <h2>{error}</h2>
      ) : loading ? (
        <h2>Loading...</h2>
      ) : (
        <main>
          <ReactApexChart options={bars.options} series={bars.series} type="bar" height={150} />
          <ReactApexChart options={plot.options} series={plot.series} type="line" height={350} />

          <div>
            <h3>Page Hits By User</h3>
            <h5>* Number of users without pageHits: {usersCount - pageHitsByUser.length}</h5>
            {pageHitsByUser.map((user, idx: number) => (
              <div key={user._id.user}>
                <h4>
                  <span>{idx + 1} - </span>
                  <span>User ID: {user._id.user},</span>
                  &nbsp;
                  <span>Number of visits: {user.pageHitsCount}</span>
                </h4>
                <table>
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
                    {user.pageHits.map((p) => (
                      <tr key={p._id}>
                        <td>{new Date(p.createdAt).toLocaleString()}</td>
                        <td>
                          {p.country}
                          {p.flagSVG && (
                            <img
                              src={p.flagSVG}
                              alt="country flag"
                              width="30px"
                              height="17px"
                            />
                          )}
                        </td>
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
      )}
    </div>
  );
}

export default DataStateProvider(Dashboard);
