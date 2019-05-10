# pheonix
A website based on pulmoni on aws for serving simple static assets and a form. 

https://pulumi.io/quickstart/

To get started install pulumi, nodejs, awscli, and set up all of the relevant ids/perms/creds etc.

# flow
You use the pulumi cli to do pretty much everything. Create a new stack, deploy to it, update it, get logs from it, destroy it, etc.

# how?
index.js has everything. Pulumi has different api/libs to descibe iaas. I've used the highest level one that doesn't name names so theoretically it could go on azure or wherever. It's also the easiest to use configuration wise. Functions turn into lambdas, endpoints into apis, and tables into DDB. There's a magic static route that results in storing www files into s3 and returning them on api gateway.
