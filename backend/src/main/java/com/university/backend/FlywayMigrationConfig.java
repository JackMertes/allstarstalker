package com.university.backend;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!test")
public class FlywayMigrationConfig {

	@Bean(initMethod = "migrate")
	public Flyway flyway(DataSource dataSource) {
		// Existing DBs populated before Flyway (tables but no flyway_schema_history) need baseline.
		// baselineVersion=4 matches latest migration so we do not re-run CREATE/INSERT scripts.
		return Flyway.configure()
			.dataSource(dataSource)
			.locations("classpath:db/migration")
			.baselineOnMigrate(true)
			.baselineVersion("4")
			.load();
	}

	@Bean
	public static BeanFactoryPostProcessor entityManagerFactoryDependsOnFlyway() {
		return (ConfigurableListableBeanFactory beanFactory) -> {
			if (beanFactory.containsBeanDefinition("entityManagerFactory")
				&& beanFactory.containsBeanDefinition("flyway")) {
				beanFactory.getBeanDefinition("entityManagerFactory")
					.setDependsOn("flyway");
			}
		};
	}
}
