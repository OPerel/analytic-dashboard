import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DataStateProvider, { useDataContext, DataActionTypes } from '../../context/dataContext';
import fetchDecorator from '../../utils/fetchFromApi';
import Auth from '../../utils/oktaAuth';

const Dashboard: React.FC = () => {

  const { state, dispatch } = useDataContext();
  const {
    loading,
    error,
    users,
    pageHits,
    pageHitsByDay,
    uniqueUsersByDay
  } = state;

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

  const usersReq = new Request(`${process.env.REACT_APP_API}/users`);
  const pageHitsReq = new Request(`${process.env.REACT_APP_API}/pageHits`);
  const usersByDayReq = new Request(`${process.env.REACT_APP_API}/uniqueUsersByDay`);
  const pageHitsByDayReq = new Request(`${process.env.REACT_APP_API}/pageHitsByDay`);

  useEffect(() => {
    dispatch({ type: DataActionTypes.FETCH });
    fetchDecorator(usersReq)
      .then(res => dispatch({ type: DataActionTypes.SET_USERS, payload: res }))
      .catch(err => dispatch({ type: DataActionTypes.SET_ERROR, payload: err }));

    dispatch({ type: DataActionTypes.FETCH });
    fetchDecorator(pageHitsReq)
      .then(res => dispatch({ type: DataActionTypes.SET_PAGE_HITS, payload: res }))
      .catch(err => dispatch({ type: DataActionTypes.SET_ERROR, payload: err }));

    fetchDecorator(usersByDayReq)
      .then(res => dispatch({ type: DataActionTypes.SET_USERS_BY_DAY, payload: res }))
      .catch(err => dispatch({ type: DataActionTypes.SET_ERROR, payload: err }));

    fetchDecorator(pageHitsByDayReq)
      .then(res => dispatch({ type: DataActionTypes.SET_PAGE_HITS_BY_DAY, payload: res }))
      .catch(err => dispatch({ type: DataActionTypes.SET_ERROR, payload: err }));
  }, []);
  
  console.log('state: ', state);

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
            {users.map((user: any) => (
              <div key={user._id}>
                <h3>
                  <span>User ID: {user._id}</span>
                  <span>User Created At: {new Date(user.createdAt).toLocaleString()}</span>
                </h3>
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
      )}
    </div>
  );
}

export default DataStateProvider(Dashboard);
