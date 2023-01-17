INSERT INTO users (username, password, name, email)
VALUES ('testuser1',
        'pass1',
        'name1',
        'testuser1@schedule.com'),
        ('testuser2',
        'pass2',
        'name2',
        'testuser2@schedule.com'),
        ('mockUser1',
        'pass1',
        'mockName1',
        'mockEmail1@schedule.com');


INSERT INTO events (username, event_name, event_start_time, event_end_time, event_duration, event_location, event_priority, event_isFlexible)
VALUES  ('testuser1', 'event1', '2023-01-17 09:00:00+00', '2023-01-17 10:00:00+00', 60, 'location1', 1, False),
        ('testuser1', 'event12', '2023-01-17 15:00:00+00', '2023-01-17 17:00:00+00', 120, 'location11', 2, False),
        ('testuser2', 'event2', '2023-01-17 11:00:00+00', '2023-01-17 12:00:00+00', 60, 'location2', 1, False),
        ('testuser2', 'event22', '2023-01-17 10:00:00+00', '2023-01-17 16:00:00+00', 360, 'location21', 2, False),
        ('testuser1', 'event11', NULL, NULL, 60, 'location1', 1, True),
        ('testuser1', 'event121', NULL, NULL, 120, 'location11', 2, True),
        ('testuser2', 'event22', NULL, NULL, 60, 'location2', 1, True),
        ('testuser2', 'event222', NULL, NULL, 120, 'location21', 2, True),
        ('testuser1', 'event1211', NULL, NULL, 180, 'location1', 3, True),
        ('mockUser1', 'mock1Event1', NULL, NULL, 60, 'place_id:ChIJB7RfXFl2hlQRpb-Vv0SYE3A', 3, True),
        ('mockUser1', 'mock1Event2', '2023-01-17 9:00:00+00', '2023-01-17 9:30:00+00', 30, 'place_id:ChIJAdUOuNByhlQRhQeijXRE-iA', 3, False), 
        ('mockUser1', 'mock1Event3', NULL, NULL, 180, 'place_id:ChIJAx7UL8xyhlQR86Iqc-fUncc', 1, True),
        ('mockUser1', 'mock1Event4', '2023-01-17 11:45:00+00', '2023-01-17 12:45:00+00', 60, 'place_id:ChIJq2mxU7xzhlQRJQw6V0QuGrg', 2, False);

INSERT INTO schedules (schedule_date, username, schedule_start_time, schedule_end_time)
VALUES  ('2023-05-12', 'testuser1', '2023-05-12 07:00:00', '2023-05-12 22:00:00'),
        ('2023-05-13', 'testuser1', '2023-05-13 07:00:00', '2023-05-13 22:00:00'),
        ('2023-05-12', 'testuser2', '2023-05-12 07:00:00', '2023-05-12 22:00:00'),
        ('2023-05-13', 'testuser2', '2023-05-13 07:00:00', '2023-05-13 22:00:00'),
        ('2023-05-13', 'mockUser1', '2023-01-17 06:00:00+00', '2023-01-17 22:00:00+00');



