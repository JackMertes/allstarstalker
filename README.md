# Specification Document

<!-- Please fill out this document to reflect your team's project. This is a living document and will need to be updated regularly. You may also remove any section to its own document (e.g. a separate standards and conventions document), however you must keep the header and provide a link to that other document under the header.

Also, be sure to check out the Wiki for information on how to maintain your team's requirements.
-->
## TeamName

Star Stalker
 <!--The name of your team.-->

### Project Abstract

<!--A one paragraph summary of what the software will do.
This is an example paragraph written in markdown. You can use *italics*, **bold**, and other formatting options. You can also <u>use inline html</u> to format your text. The example sections included in this document are not necessarily all the sections you will want, and it is possible that you won't use all the one's provided. It is your responsibility to create a document that adequately conveys all the information about your project specifications and requirements.
-->
Team 3b will create a Celebrity Flight Tracker. This project will read flight logs and track relevant information pertaining to celebrities and their flights. Users will be able to look up and filter through this information with a variety of characteristics such as the name of the celebrity, airport destination/origin, travel dates and so on.

### Customer
<!--A brief description of the customer for this software, both in general (the population who might eventually use such a system) and specifically for this document (the customer(s) who informed this document). Every project will have a customer from the CS506 instructional staff. Requirements should not be derived simply from discussion among team members. Ideally your customer should not only talk to you about requirements but also be excited later in the semester to use the system.-->
The customer base for this software are those who are curious about the traveling habits or wherabouts of celebrities. The software will be available publically. 

### Specification

<!--A detailed specification of the system. UML, or other diagrams, such as finite automata, or other appropriate specification formalisms, are encouraged over natural language.-->

<!--Include sections, for example, illustrating the database architecture (with, for example, an ERD).-->

<!--Included below are some sample diagrams, including some example tech stack diagrams.-->

#### Technology Stack

```mermaid
flowchart RL
subgraph Front End
	A(Javascript: React)
end
	
subgraph Back End
	B(Java: SpringBoot)
end
	
subgraph Database
	C[(MySQL)]
end

A <-->|"REST API"| B
B <--> C
```

#### Database
In Progress

#### Class Diagram
In Progress
<!--
```mermaid
---
title: Sample Class Diagram for Animal Program
---
classDiagram
    class Animal {
        - String name
        + Animal(String name)
        + void setName(String name)
        + String getName()
        + void makeSound()
    }
    class Dog {
        + Dog(String name)
        + void makeSound()
    }
    class Cat {
        + Cat(String name)
        + void makeSound()
    }
    class Bird {
        + Bird(String name)
        + void makeSound()
    }
    Animal <|-- Dog
    Animal <|-- Cat
    Animal <|-- Bird
```
-->

#### Flowchart
In Progress. Generic Example:
```mermaid
---
title: Sample Program Flowchart
---
graph TD;
    Start([Start]) --> Input_Data[/Input Data/];
    Input_Data --> Process_Data[Process Data];
    Process_Data --> Validate_Data{Validate Data};
    Validate_Data -->|Valid| Process_Valid_Data[Process Valid Data];
    Validate_Data -->|Invalid| Error_Message[/Error Message/];
    Process_Valid_Data --> Analyze_Data[Analyze Data];
    Analyze_Data --> Generate_Output[Generate Output];
    Generate_Output --> Display_Output[/Display Output/];
    Display_Output --> End([End]);
    Error_Message --> End;
```

#### Behavior
In Progress
<!-- add extra line to each arrow below when uncommenting
```mermaid
---
title: State Diagram For Celebrity Flight Tracker
---
stateDiagram
    [*] -> Ready
    Ready -> Highlight Search Box : Click Search Box
    Highlight Search Box -> Search: Enter Name
		Search -> Query DB: Process Search Term
		Query Name -> Result Set: Query DB
		Result Set -> Backend: Process Results
		Backend -> Frontend: Display Results
```
-->

#### Sequence Diagram
In Progress
<!-- arros below were tampered to allow comment
```mermaid
sequenceDiagram

participant ReactFrontend
participant SpringBoot
participant MySQLDatabase

ReactFrontend ->> SpringBoot: HTTP Request (e.g., GET /api/data)
activate DjangoBackend

SpringBoot ->> MySQLDatabase: Query (e.g., SELECT * FROM data_table)
activate MySQLDatabase

MySQLDatabase ->> SpringBoot: Result Set
deactivate MySQLDatabase

SpringBoot ->> ReactFrontend: JSON Response
deactivate DjangoBackend
```
-->
### Standards & Conventions

<!--This is a link to a seperate coding conventions document / style guide-->
[Style Guide & Conventions](STYLE.md)
