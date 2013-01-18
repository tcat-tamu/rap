/*******************************************************************************
 * Copyright (c) 2007, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 *     EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.ui.internal.progress;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.jobs.IJobChangeEvent;
import org.eclipse.core.runtime.jobs.IJobChangeListener;
import org.eclipse.core.runtime.jobs.IJobManager;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.core.runtime.jobs.JobChangeAdapter;
import org.eclipse.core.runtime.jobs.ProgressProvider;
import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.internal.lifecycle.LifeCycleUtil;
import org.eclipse.rap.rwt.internal.serverpush.ServerPushManager;
import org.eclipse.rap.rwt.internal.service.ContextProvider;
import org.eclipse.rap.rwt.service.UISession;
import org.eclipse.rap.rwt.service.UISessionEvent;
import org.eclipse.rap.rwt.service.UISessionListener;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.internal.progress.ProgressManager;
import org.eclipse.ui.progress.UIJob;


public class JobManagerAdapter extends ProgressProvider implements IJobChangeListener {

  private static JobManagerAdapter _instance;
  private final Map jobs;
  private final ProgressManager defaultProgressManager;
  final Object lock;

  public static synchronized JobManagerAdapter getInstance() {
    if( _instance == null ) {
      _instance = new JobManagerAdapter();
    }
    return _instance;
  }

  private JobManagerAdapter() {
    // To avoid deadlocks we have to use the same synchronization lock.
    // If anyone has a better idea - you're welcome.
    IJobManager jobManager = Job.getJobManager();
    Class clazz = jobManager.getClass();
    try {
      Field jobManagerLock = clazz.getDeclaredField( "lock" );
      jobManagerLock.setAccessible( true );
      lock = jobManagerLock.get( jobManager );
    } catch( final Throwable thr ) {
      String msg = "Could not initialize synchronization lock.";
      throw new IllegalStateException( msg );
    }
    jobs = new HashMap();
    defaultProgressManager = new ProgressManager();
    Job.getJobManager().setProgressProvider( this );
    Job.getJobManager().addJobChangeListener( this );
  }

  ///////////////////
  // ProgressProvider

  @Override
  public IProgressMonitor createMonitor( final Job job ) {
    IProgressMonitor result = null;
    ProgressManager manager = findSessionProgressManager( job );
    if( manager != null ) {
      result = manager.createMonitor( job );
    }
    return result;
  }

  @Override
  public IProgressMonitor createMonitor( final Job job,
                                         final IProgressMonitor group,
                                         final int ticks )
  {
    IProgressMonitor result = null;
    ProgressManager manager = findSessionProgressManager( job );
    if( manager != null ) {
      result = manager.createMonitor( job, group, ticks );
    }
    return result;
  }

  @Override
  public IProgressMonitor createProgressGroup() {
    return defaultProgressManager.createProgressGroup();
  }

  ///////////////////////////////
  // interface IJobChangeListener

  public void aboutToRun( final IJobChangeEvent event ) {
    ProgressManager manager = findProgressManager( event.getJob() );
    manager.changeListener.aboutToRun( event );
  }

  public void awake( final IJobChangeEvent event ) {
    ProgressManager manager = findProgressManager( event.getJob() );
    manager.changeListener.awake( event );
  }

  public void done( final IJobChangeEvent event ) {
    final ProgressManager[] manager = new ProgressManager[ 1 ];
    Display display = null;
    synchronized( lock ) {
      try {
        manager[ 0 ] = findProgressManager( event.getJob() );
        display = ( Display )jobs.get( event.getJob() );
      } finally {
        jobs.remove( event.getJob() );
      }
    }
    if( display != null && !display.isDisposed() ) {
      display.asyncExec( new Runnable() {
        public void run() {
          ServerPushManager.getInstance().deactivateServerPushFor( event.getJob() );
          manager[ 0 ].changeListener.done( event );
        }
      } );
    } else {
      // RAP [rh] fixes bug 283595
      event.getJob().cancel();
      manager[ 0 ].changeListener.done( event );
    }
  }

  public void running( final IJobChangeEvent event ) {
    ProgressManager manager = findProgressManager( event.getJob() );
    manager.changeListener.running( event );
  }

  public void scheduled( final IJobChangeEvent event ) {
    ProgressManager manager;
    Display display = findDisplay( event.getJob() );
    synchronized( lock ) {
      if( display != null ) {
        jobs.put( event.getJob(), display );
        Runnable runnable = new Runnable() {

          public void run() {
            bindToSession( event.getJob() );
            ServerPushManager.getInstance().activateServerPushFor( event.getJob() );
          }
        };
        RWT.getUISession( display ).exec( runnable );
      }
      manager = findProgressManager( event.getJob() );
    }
    manager.changeListener.scheduled( event );
  }

  public void sleeping( final IJobChangeEvent event ) {
    ProgressManager manager = findProgressManager( event.getJob() );
    manager.changeListener.sleeping( event );
  }

  //////////////////
  // helping methods

  private ProgressManager findProgressManager( final Job job ) {
    ProgressManager result = findSessionProgressManager( job );
    if( result == null ) {
      result = defaultProgressManager;
    }
    return result;
  }

  private ProgressManager findSessionProgressManager( final Job job ) {
    synchronized( lock ) {
      final ProgressManager result[] = new ProgressManager[ 1 ];
      Display display = ( Display )jobs.get( job );
      if( display != null ) {
        RWT.getUISession( display ).exec( new Runnable() {
          public void run() {
            result[ 0 ] = ProgressManager.getInstance();
          }
        } );
        if( result[ 0 ] == null ) {
          String msg = "ProgressManager must not be null.";
          throw new IllegalStateException( msg );
        }
      } else {
        result[ 0 ] = null;
      }
      return result[ 0 ];
    }
  }

  private static Display findDisplay( final Job job ) {
    Display result = null;
    if( ContextProvider.hasContext() ) {
      result = LifeCycleUtil.getSessionDisplay();
    } else {
      if( job instanceof UIJob ) {
        UIJob uiJob = ( UIJob )job;
        result = uiJob.getDisplay();
        if( result == null ) {
          String msg = "UIJob "
                     + uiJob.getName()
                     + " cannot be scheduled without an associated display.";
          throw new IllegalStateException( msg );
        }
      }
    }
    return result;
  }

  private void bindToSession( final Job job ) {
    final AtomicBoolean jobDone = new AtomicBoolean();
    final UISession uiSession = RWT.getUISession();
    final UISessionListener cleanupListener = new UISessionListener() {

      public void beforeDestroy( UISessionEvent event ) {
        if( !jobDone.get() ) {
          try {
            cleanup( job );
          } finally {
            synchronized( lock ) {
              jobs.remove( job );
            }
          }
        }
      }

      private void cleanup( final Job jobToRemove ) {
        // ////////////////////////////////////////////////////////////////////
        // TODO [fappel]: Very ugly hack to avoid a memory leak.
        // As a job can not be removed from the
        // running set directly, I use reflection. Jobs
        // can be catched in the set on session timeouts.
        // Don't know a proper solution yet.
        // Note that this is still under investigation.
        Display display = ( Display )jobs.get( jobToRemove );
        if( display != null ) {
          RWT.getUISession( display ).exec( new Runnable() {
            public void run() {
              jobToRemove.cancel();
              jobToRemove.addJobChangeListener( new JobCanceler() );
            }
          } );
        }
        try {
          IJobManager jobManager = Job.getJobManager();
          Class clazz = jobManager.getClass();
          Field running = clazz.getDeclaredField( "running" );
          running.setAccessible( true );
          Set set = ( Set )running.get( jobManager );
          synchronized( lock ) {
            set.remove( job );
            // still sometimes job get catched - use the job marker adapter
            // to check whether they can be eliminated
            Object[] runningJobs = set.toArray();
            for( int i = 0; i < runningJobs.length; i++ ) {
              Job toCheck = ( Job )runningJobs[ i ];
              IJobMarker marker = ( IJobMarker )toCheck.getAdapter( IJobMarker.class );
              if( marker != null && marker.canBeRemoved() ) {
                set.remove( toCheck );
              }
            }
          }
        } catch( final Throwable thr ) {
          // TODO [fappel]: exception handling
          thr.printStackTrace();
        }
      }
    };
    uiSession.addUISessionListener( cleanupListener );
    job.addJobChangeListener( new JobChangeAdapter() {
      @Override
      public void done( final IJobChangeEvent event ) {
        jobDone.set( true );
        uiSession.removeUISessionListener( cleanupListener );
      }
    } );
  }
}
