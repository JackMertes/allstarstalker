package com.university.backend;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayMigrationConfig {

	@Bean(initMethod = "migrate")
	public Flyway flyway(DataSource dataSource) {
		return Flyway.configure()
			.dataSource(dataSource)
			.locations("classpath:db/migration")
			.baselineOnMigrate(false)
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
