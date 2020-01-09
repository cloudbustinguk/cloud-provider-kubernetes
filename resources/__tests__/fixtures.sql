insert into protocol (id, name, default_port)
values (1, "RDP", 3389);
insert into protocol (id, name, default_port)
values (2, "SSH", 22);
insert into protocol (id, name, default_port)
values (3, "HTTP", 80);
insert into protocol (id, name, default_port)
values (4, "HTTPS", 443);
insert into protocol (id, name, default_port)
values (5, "GUACD", 4822);

insert into image (id, name, path, description, command, args)
values (1, "image 1", "repo1/image-name1", "An image", "start.sh", "jupyter,notebook,--NotebookApp.token=''");
insert into image (id, name, path, description)
values (2, "image 2", "repo2/image-name2", "Another image");
insert into image (id, name, path, description)
values (3, "image 3", "repo3/image-name3", "A image not associated to an instance");

insert into image_protocol (id, port, image_id, protocol_id)
values (1, 3389, 1, 1);
insert into image_protocol (id, port, image_id, protocol_id)
values (2, 22, 1, 2);
insert into image_protocol (id, port, image_id, protocol_id)
values (3, 3389, 2, 1);
insert into image_protocol (id, port, image_id, protocol_id)
values (4, 8888, 2, 3);
insert into image_protocol (id, port, image_id, protocol_id)
values (5, 3389, 3, 1);
insert into image_protocol (id, port, image_id, protocol_id)
values (6, 443, 3, 4);

insert into image_volume (id, name, path, readonly, image_id)
values (1, 'volume1', '/path', false, 1);
insert into image_volume (id, name, path, readonly, image_id)
values (2, 'volume2', '/path', true, 2);
insert into image_volume (id, name, path, readonly, image_id)
values (3, 'volume3', '/path', false, 3);

insert into flavour(id, name, description, cpu, memory)
values (1, "flavour 1", "A flavour", 1.5, 2048);
insert into flavour(id, name, description, cpu, memory)
values (2, "flavour 2", "Another flavour", 8, 8192);
insert into flavour(id, name, description, cpu, memory)
values (3, "flavour 3", "A flavour not associated to an instance", 8, 8192);

insert into instance(id, name, description, image_id, flavour_id, hostname, status, current_cpu, current_memory, namespace, created_at, updated_at)
values (1, "instance1", "A test instance", 1, 1, "instance1.host.eu", "BUILDING", 0, 0, 'panosc', '2019-01-01', '2019-01-01');
insert into instance(id, name, description, image_id, flavour_id, hostname, status, current_cpu, current_memory, namespace, created_at, updated_at)
values (2, "instance2", "Another test instance", 2, 2, "instance2.host.eu", "BUILDING", 0, 0, 'panosc', '2019-01-01', '2019-01-01');
insert into instance(id, name, description, image_id, flavour_id, hostname, status, current_cpu, current_memory, namespace, created_at, updated_at)
values (3, "instance3", "A third test instance", 2, 2, "instance3.host.eu", "BUILDING", 0, 0, 'panosc', '2019-01-01', '2019-01-01');
insert into instance(id, name, description, image_id, flavour_id, hostname, status, current_cpu, current_memory, namespace, created_at, updated_at, deleted)
values (4, "instance4", "A deleted instance", 2, 2, "instance3.host.eu", "DELETED", 0, 0, 'panosc', '2019-01-01', '2019-01-01', true);
insert into instance(id, name, description, image_id, flavour_id, hostname, status, current_cpu, current_memory, namespace, created_at, updated_at)
values (5, "instance5", "A fifth test instance", 2, 2, "instance3.host.eu", "ACTIVE", 0, 0, 'panosc', '2019-01-01', '2019-01-01');

insert into instance_user(id, account_id, username, first_name, last_name, uid, gid, home_path, instance_id)
values (1, 123, "bloggs", "joe", "bloggs", 1000, 2000, "/home/bloggs", 1);
insert into instance_user(id, account_id, username, first_name, last_name, uid, gid, home_path, instance_id)
values (2, 321, "doe", "jane", "doe", 1001, 2000, "/home/doe", 2);
insert into instance_user(id, account_id, username, first_name, last_name, uid, gid, home_path, instance_id)
values (3, 456, "parker", "peter", "parker", 1002, 2000, "/home/parker", 3);
insert into instance_user(id, account_id, username, first_name, last_name, uid, gid, home_path, instance_id)
values (4, 678, "bloggs", "joe", "bloggs", 1000, 2000, "/home/bloggs", 4);
insert into instance_user(id, account_id, username, first_name, last_name, uid, gid, home_path, instance_id)
values (5, 321, "doe", "jane", "doe", 1001, 2000, "/home/doe", 5);

insert into instance_protocol (id, name, port, instance_id)
values (1, "RDP", 30389, 5);
